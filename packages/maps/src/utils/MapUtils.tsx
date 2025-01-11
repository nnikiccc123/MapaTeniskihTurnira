import React from 'react';
import ReactDOM from 'react-dom/client';
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import * as Proj from "ol/proj";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import TextStyle from "ol/style/Text";
import {getSurfaceName, Surfaces, TennisTournament, TournamentUtils} from "./TournamentUtils";
import {TournamentsTooltip} from "../comp/TournamentsTooltip";
import {isMobile} from "./CommonUtil";
import App from "../App";


let mapInstance: Map = null;

export const setMapInstance = (map: Map) => {
    mapInstance = map;
}


export class MapUtils {

    static flyTo(map: Map, location, done) {
        let duration = 1000;
        let view = map.getView();
        let zoom = view.getZoom();
        let parts = 2;
        let called = false;
        let callback = (complete) => {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
                called = true;
                if (done) {
                    done(complete);
                }
            }
        };
        view.animate({
            center: location,
            duration: duration
        }, callback);
        view.animate({
            zoom: zoom - 1,
            duration: duration / 2
        }, {
            zoom: zoom,
            duration: duration / 2
        }, callback);
    }

    static createTournamentsTooltipOverlay(map: Map, tournaments: TennisTournament[], location): Overlay {
        if (tournaments && tournaments.length && location) {
            let div = document.createElement('div');
            div.style.position = "relative";
            div.style.zIndex = "0";
            ReactDOM.createRoot(div).render(<TournamentsTooltip tournaments={tournaments} maxtoshow={isMobile ? 5 : 8}/>);

            let move = 0;
            for (let t of tournaments) {
                move = Math.max(move, MapUtils.getFeatureCircleSize(t));
            }
            move = Math.max(move, 7);

            const overlay = new Overlay({
                position: location,
                element: div,
                offset: [0, -move - 2],
                positioning: 'center-center'
            });
            map.addOverlay(overlay);

            return overlay;
        }
    }

    static createSurfaceBadgeElement = (surfaceCode: Surfaces) => {
        return <span className={`small-badge ${MapUtils.getFillClassName(surfaceCode)}`}>{getSurfaceName(surfaceCode)}</span>;
    }

    static createCategoryBadgeElement = (categoryId: string) => {
        return <span style={{fontWeight: "bold", fontSize: "0.85em"}}>{categoryId}</span>;
    }

    static createTournamentBadgeElement = (t: TennisTournament) => {
        let surfaceEl = this.createSurfaceBadgeElement(t.surfaceCode);
        let inoutEl = t.isOutdoors !== null ?
            <span title={t.isOutdoors ? "Outdoors" : "Indoors"} className={t.isOutdoors ? "outdoors-badge" : "indoors-badge"}>
                {t.isOutdoors ? "Out" : "In"}
            </span> :
            null;
        return (
            <span className={"nowrap"} style={{marginLeft: "0.5rem"}}>
                {this.createCategoryBadgeElement(t.categoryId)} {inoutEl} {surfaceEl}
            </span>
        )
    }

    static getFillClassName = (surfaceCode: Surfaces): string => {
        switch (surfaceCode) {
            case Surfaces.clay: return "clay-fill";
            case Surfaces.carpet: return "carpet-fill";
            case Surfaces.hard: return "hard-fill";
            case Surfaces.grass: return "grass-fill";
            case Surfaces.other: return "other-fill";
        }
    }

    public static getSurfaceColor = (surfaceCode: Surfaces): string => {
        switch (surfaceCode) {
            case Surfaces.clay: return "rgba(206, 103, 0, 0.8)";
            case Surfaces.carpet: return "rgba(131, 182, 8, 0.8)";
            case Surfaces.hard: return "rgba(3, 136, 220, 0.8)";
            case Surfaces.grass: return "rgba(2, 164, 59, 0.8)";
            case Surfaces.other: return "rgba(160, 160, 160, 0.8)";
        }
    }

    private static getFeatureCircleSize = (tournamentInfo: TennisTournament): number => {
        const importance: number = tournamentInfo?.importance;
        return 3 + importance;
    }

    private static styleCache = {};

    static getSingleTournamentStyle = (tournamentInfo: TennisTournament, forceColor = null): Style => {
        const isActive = TournamentUtils.isActiveTournament(tournamentInfo);
        const surfaceCode: Surfaces = tournamentInfo?.surfaceCode;
        const size: number = MapUtils.getFeatureCircleSize(tournamentInfo);

        const fillColor = forceColor || MapUtils.getSurfaceColor(surfaceCode);

        const cacheKey = `t_${size}_${fillColor}_${isActive}`;

        let cachedStyle = MapUtils.styleCache[cacheKey];
        if (!cachedStyle) {
            cachedStyle = new Style({
                image: new CircleStyle({
                    radius: size,
                    fill: new Fill({
                        color: fillColor,
                    }),
                    stroke: new Stroke({
                        color: isActive ? "rgb(255, 0, 0)" : "rgba(0, 0, 0, 0.6)",
                        width: isActive ? size / 3 : 1,
                    }),
                }),
            });
            MapUtils.styleCache[cacheKey] = cachedStyle;
        }

        return cachedStyle;
    }

    static getClusterTournamentStyle = (clusterFeature, forceColor = null): Style => {
        const features = clusterFeature.get('features');
        const size = features.length;

        if (size === 1) {
            return MapUtils.getSingleTournamentStyle(features[0].get("info"), forceColor);
        }

        let firstTournament: TennisTournament = features[0].get("info");

        let circleSize = MapUtils.getFeatureCircleSize(firstTournament);

        let hasActive = false;
        for (const f of features) {
            const tournamentInfo = f.get("info");
            circleSize = Math.max(circleSize, MapUtils.getFeatureCircleSize(tournamentInfo));
            if (tournamentInfo && TournamentUtils.isActiveTournament(tournamentInfo)) {
                hasActive = true;
            }
        }
        if (hasActive) {
            circleSize += 1.5;
        }

        let fillColor = forceColor || MapUtils.getSurfaceColor(firstTournament.surfaceCode);

        const cacheKey = `g_${size}_${circleSize}_${fillColor}_${hasActive}`;
        let cachedStyle = MapUtils.styleCache[cacheKey];
        if (!cachedStyle) {
            cachedStyle = new Style({
                image: new CircleStyle({
                    radius: Math.max(7, circleSize),
                    fill: new Fill({
                        color: fillColor,
                    }),
                    stroke: new Stroke({
                        color: hasActive ? "rgb(255, 0, 0)" : "rgba(0, 0, 0, 0.6)",
                        width: hasActive ? 2 : 1,
                    }),
                }),
                text: new TextStyle({
                    text: size.toString(),
                    fill: new Fill({
                        color: 'rgb(255, 255, 255)',
                    }),
                    font: '9px sans-serif',
                    textBaseline: "middle",
                    textAlign: "center",
                    offsetX: 0,
                    offsetY: 1
                }),
            });
            MapUtils.styleCache[cacheKey] = cachedStyle;
        }

        return cachedStyle;
    }

}