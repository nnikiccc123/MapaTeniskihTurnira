import React from 'react';
import {MapComponent} from "./MapComponent";
import './css/app.css';

export interface AppProps{
}

export interface AppState{
  zoom?: number;
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppState) {
    super(props);
    this.state = this.createInitialState();
  }

  private createInitialState(): AppState {
    return {
      zoom: 3
    };
  }

  render(): React.ReactNode {
    let s = this.state;
    return <MapComponent zoom={s.zoom}/>;
  }

}
