import React, {RefObject} from 'react';
import './css/app.css';
import {
    getTennisTourInfos,
    getTournamentInfoFactory,
    loadTennisTourInfos,
    TennisTourInfo,
    TennisTournament
} from "./utils/TournamentUtils";
import {TournamentsSideBar} from "comp/TournamentsSideBar";
import {MapUtils, setMapInstance} from "./utils/MapUtils";
import {isMobile, openUrl} from "./utils/CommonUtil";
import {Extent} from "ol/extent";
import {Global} from "./utils/GlobalUtils";
import {MapZoomControl} from "comp/MapZoomControl";
import {TennisFactory} from "utils/TennisFactory";

import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import * as Proj from "ol/proj";
import {Feature, View} from "ol";
import OLXYZSource from "ol/source/XYZ";
import OLSource from "ol/source/Source";
import {Cluster, StadiaMaps, Vector} from "ol/source";
import VectorLayer from "ol/layer/Vector";
import {Point} from "ol/geom";
import {Layer} from "ol/layer";
import Overlay from "ol/Overlay";



export enum LoadingState {
    ok,
    loading,
    error
}

interface MapProps {
    zoom: number;
}

interface MapState {
    tourInfoLoadingState: LoadingState;
    tennisFactory: TennisFactory;
    tourCode: string | null;
    seasonYear: number | null;
    loadingCalendarState: LoadingState;
    tournaments: TennisTournament[];
}


export class MapComponent extends React.Component<MapProps, MapState> {

    private map: Map;
    private baseTileLayer: TileLayer<any>;
    private tourLayer: Layer<any> = null;

    private highlightedFeature = null;

    private tooltipFeature: any = null;
    private tooltipOverlay: Overlay = null;
    private firstMoveTimeOnEmptyMap = null;
    private timeToMoveToOverlayTolerance = 250;

    private mapRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private tournamentsSideBarRef: RefObject<TournamentsSideBar> = React.createRef<TournamentsSideBar>();


    constructor(props: MapProps) {
        super(props);
        this.baseTileLayer = new TileLayer<any>();

        this.state = {
            tourInfoLoadingState: LoadingState.loading,
            tennisFactory: null,
            tourCode: null,
            seasonYear:  null,
            loadingCalendarState: LoadingState.ok,
            tournaments: []
        };
    }


    getMap(): Map {
        return this.map;
    }


    public setBaseMap(source: OLSource) {
        this.baseTileLayer.setSource(source);
    }

    componentDidMount() {
        this.map = new Map({
            controls: [],
            layers: [
                this.baseTileLayer,
            ],
            target: 'map',
        });

        setMapInstance(this.map);

        this.map.setView(new View({
            center: [637771, 5360653],
            rotation: 0,
            zoom: this.props.zoom,
            minZoom: 2,
            maxZoom: 11
        }));

        this.map.on('movestart', e => {
        });
        this.map.on('moveend', () => {
            this.extentChanged();
        });
        this.map.on('pointermove', this.onMove);
        this.map.on('singleclick', this.onClick);

        this.setBaseMap(new OLXYZSource({url: 'https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoidm5pa2ljIiwiYSI6ImNqaWxwazV4czA3cXgzcWs3OTdsNmd4cmgifQ.M2a6z4CUSfG1sM0qX2QdeA'}));
        this.extentChanged();

        loadTennisTourInfos(
            () => {
                let tennisTourInfos = getTennisTourInfos();
                let firstTourInfo: TennisTourInfo = tennisTourInfos.length > 0 ? tennisTourInfos[0] : null;
                this.setState({
                    tourInfoLoadingState: LoadingState.ok,
                    tourCode: firstTourInfo?.id,
                    seasonYear: firstTourInfo?.yearTo
                });
                this.setCalendarSource(firstTourInfo?.id, firstTourInfo?.yearTo);
            },
            reason => this.setState({tourInfoLoadingState: LoadingState.error})
        );
    }

    private setCalendarSource = (tourCode: string, year: number): void => {
        if (tourCode && year) {
            this.clearMap();
            let tournamentInfoFactory = getTournamentInfoFactory(tourCode);
            this.setState({
                tennisFactory: tournamentInfoFactory,
                tourCode: tourCode,
                seasonYear: year,
                loadingCalendarState: LoadingState.loading,
                tournaments: []
            });

            tournamentInfoFactory.load(tourCode, year).then(tournaments =>
                this.setState({
                    loadingCalendarState: LoadingState.ok,
                    tournaments: tournaments
                })
            );
        }
    }

    private clearMap = (): void => {
        if (this.tourLayer) {
            this.map.removeLayer(this.tourLayer);
        }
        this.clearTooltip();
    }

    private addPointsToMap = (tournaments: TennisTournament[]): void => {
        if (tournaments) {
            let vectorSource: Vector<any> = new Vector({});
            for (let t of tournaments) {
                if (t.lon && t.lat) {
                    let feature = new Feature({
                        id: t.id,
                        geometry: new Point(Proj.fromLonLat([t.lon, t.lat]))
                    });
                    feature.set("info", t);
                    vectorSource.addFeature(feature);
                }
            }
            const clusterSource = new Cluster({
                distance: 14,
                minDistance: 14,
                source: vectorSource,
            });
            this.tourLayer = new VectorLayer({
                source: clusterSource,
                style: (feature, resolution) => MapUtils.getClusterTournamentStyle(feature)
            });
            this.map.addLayer(this.tourLayer);
        }
    }


    private extentChanged = () => {
        if (this.tournamentsSideBarRef.current) {
            this.tournamentsSideBarRef.current.setMapExtent(this.getExtent());
        }
    }

    private findFeatureAtPixel = (pixel) => {
        if (pixel) {
            return this.map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            }, {hitTolerance: isMobile ? 3 : 0});
        }
        return null;
    }


    private onActionAtPixel = (pixel): void => {
        const feature = this.findFeatureAtPixel(pixel);

        if (feature) {
            if (feature != this.tooltipFeature) {
                this.firstMoveTimeOnEmptyMap = null;
                this.timeToMoveToOverlayTolerance = 250;
                this.clearTooltip();
                let tournaments: TennisTournament[] = [];
                const featuresAtPoint = feature.get('features');
                if (featuresAtPoint) {
                    featuresAtPoint.forEach(f => tournaments.push(f?.get("info")));
                }
                const ext = feature.getGeometry().getExtent();
                this.tooltipFeature = feature;
                this.tooltipOverlay = MapUtils.createTournamentsTooltipOverlay(this.map, tournaments,
                                                        [(ext[0] + ext[2]) / 2, (ext[1] + ext[3]) / 2]);

                this.highlightTournament(tournaments[0]);
            }
        } else {
            if (!isMobile && !this.firstMoveTimeOnEmptyMap) {
                this.firstMoveTimeOnEmptyMap = Date.now();
            }
            if ( isMobile || (this.firstMoveTimeOnEmptyMap && (Date.now() - this.firstMoveTimeOnEmptyMap) > this.timeToMoveToOverlayTolerance) ) {
                this.clearTooltip();
            }
        }
    }

    private clearTooltip = () => {
        if (this.tooltipOverlay) {
            if (this.map && this.tooltipOverlay) {
                this.map.removeOverlay(this.tooltipOverlay);
            }
            this.tooltipOverlay = null;
            this.tooltipFeature = null;
            this.highlightTournament(null);
        }
    }

    private onClick = (event) => {
        if (isMobile) {
            this.clearTooltip();
            this.onActionAtPixel(event.pixel);
        } else {
            // check if this is a single tournament and if so, go to the tournament page
            const clusterFeature = this.findFeatureAtPixel(event.pixel);
            if (clusterFeature) {
                const features = clusterFeature.get('features');
                const size = features?.length;
                if (size === 1) {
                    openUrl(features[0]?.get("info")?.url);
                }
            }
        }
    }

    private onMove = (event) => {
        if (!isMobile && event.originalEvent.target?.tagName?.trim()?.toLowerCase() === "canvas") {
            this.onActionAtPixel(event.pixel);
        }
    }


    getZoom() {
        return this.map.getView().getZoom();
    }


    getExtent(): Extent {
        if (this.map) {
            return Proj.transformExtent(this.map.getView().calculateExtent(this.map.getSize()), "EPSG:3857", "EPSG:4326");
        }
        return null;
    }


    zoom(change: number) {
        let view = this.map.getView();
        let newZoom = view.getZoom() + change;
        if ( newZoom >= view.getMinZoom() && newZoom <= view.getMaxZoom() ) {
            view.setZoom(newZoom);
        }
    }


    private findTournamentFeature = (t: TennisTournament) => {
        if (this.tourLayer) {
            const features = this.tourLayer.getSource().getFeatures();
            if (features) {
                for (let f of features) {
                    let currT = f.get("info");
                    if (currT === t) {
                        return f;
                    } else if (!currT) {
                        const featuresAtPoint = f.get('features');
                        // if clustered feature
                        if (featuresAtPoint) {
                            for (let fp of featuresAtPoint) {
                                let currT = fp.get("info");
                                if (currT === t) {
                                    return f;
                                }
                            }
                        }
                    }
                }
            }
        }

        return null;
    }


    private highlightTournament = (tournament: TennisTournament): void => {
        const feature = tournament ? this.findTournamentFeature(tournament) : null;

        if (this.highlightedFeature && this.highlightedFeature !== feature) {
            this.highlightedFeature.setStyle(undefined);
            this.highlightedFeature = null;
        }

        if (feature) {
            this.highlightedFeature = feature;
            feature.setStyle(MapUtils.getClusterTournamentStyle(feature, "black"));
        }
    }


    render() {
        return (
            <div className={"fullscreen"}>
                <TournamentsSideBar
                    key={`tsb_${this.state.tourCode}_${this.state.seasonYear}_${Date.now()}`}
                    ref={this.tournamentsSideBarRef}
                    tourInfoLoadingState={this.state.tourInfoLoadingState}
                    loadingCalendarState={this.state.loadingCalendarState}
                    tournaments={this.state.tournaments}
                    tourCode={this.state.tourCode}
                    seasonYear={this.state.seasonYear}
                    onCalendarSourceSelected={this.setCalendarSource}
                    onFilterApplied={ts => {
                        this.clearMap();
                        this.addPointsToMap(ts);
                    }}
                    onRowClick={t => {
                        this.clearTooltip();
                        const f = this.findTournamentFeature(t);
                        if (f) {
                            this.highlightTournament(t);
                            const waaFilterOnExtent = Global.filterOnExtent;
                            Global.filterOnExtent = false;
                            MapUtils.flyTo(this.map, Proj.fromLonLat([t.lon, t.lat]), () => {
                                setTimeout(() => Global.filterOnExtent = waaFilterOnExtent, 500);
                            });
                            const ext = f.getGeometry().getExtent();
                            this.tooltipOverlay = MapUtils.createTournamentsTooltipOverlay(this.map, [t], [(ext[0] + ext[2]) / 2, (ext[1] + ext[3]) / 2]);
                            this.firstMoveTimeOnEmptyMap = null;
                            this.timeToMoveToOverlayTolerance = 1000;
                        }
                    }}
                    highlightTournament={this.highlightTournament}
                    mapExtent={this.getExtent()}
                />
                <div ref={this.mapRef} id="map" className="map">
                    <MapZoomControl onZoom={isZoomIn => this.zoom(isZoomIn ? 1 : -1)}/>
                </div>
            </div>
        );
    }

}
