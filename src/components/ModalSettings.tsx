import React from 'react'
import latest from '@maplibre/maplibre-gl-style-spec/dist/latest.json'
import type {LightSpecification, StyleSpecification, TerrainSpecification, TransitionSpecification} from 'maplibre-gl'

import FieldArray from './FieldArray'
import FieldNumber from './FieldNumber'
import FieldString from './FieldString'
import FieldUrl from './FieldUrl'
import FieldSelect from './FieldSelect'
import FieldEnum from './FieldEnum'
import FieldColor from './FieldColor'
import Modal from './Modal'
import fieldSpecAdditional from '../libs/field-spec-additional'

type ModalSettingsProps = {
  mapStyle: StyleSpecification
  onStyleChanged(...args: unknown[]): unknown
  onChangeMetadataProperty(...args: unknown[]): unknown
  isOpen: boolean
  onOpenToggle(...args: unknown[]): unknown
};

export default class ModalSettings extends React.Component<ModalSettingsProps> {
  changeTransitionProperty(property: keyof TransitionSpecification, value: number | undefined) {
    const transition = {
      ...this.props.mapStyle.transition,
    }

    if (value === undefined) {
      delete transition[property];
    }
    else {
      transition[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      transition,
    });
  }

  changeLightProperty(property: keyof LightSpecification, value: any) {
    const light = {
      ...this.props.mapStyle.light,
    }

    if (value === undefined) {
      delete light[property];
    }
    else {
      // @ts-ignore
      light[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      light,
    });
  }

  changeTerrainProperty(property: keyof TerrainSpecification, value: any) {
    const terrain = {
      ...this.props.mapStyle.terrain,
    }

    if (value === undefined) {
      delete terrain[property];
    }
    else {
      // @ts-ignore
      terrain[property] = value;
    }

    this.props.onStyleChanged({
      ...this.props.mapStyle,
      terrain,
    });
  }

  changeStyleProperty(property: keyof StyleSpecification | "owner", value: any) {
    const changedStyle = {
      ...this.props.mapStyle,
    };

    if (value === undefined) {
      // @ts-ignore
      delete changedStyle[property];
    }
    else {
      // @ts-ignore
      changedStyle[property] = value;
    }
    this.props.onStyleChanged(changedStyle);
  }

  render() {
    const metadata = this.props.mapStyle.metadata || {} as any;
    const {onChangeMetadataProperty, mapStyle} = this.props;

    const light = this.props.mapStyle.light || {};
    const transition = this.props.mapStyle.transition || {};
    const terrain = this.props.mapStyle.terrain || {} as TerrainSpecification;

    console.log(latest);

    return <Modal
      data-wd-key="modal:settings"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Style Settings'}
    >
      <div className="modal:settings">
        <FieldString
          label={"Name"}
          fieldSpec={latest.$root.name}
          data-wd-key="modal:settings.name"
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
        <FieldString
          label={"Owner"}
          fieldSpec={{doc: "Owner ID of the style. Used by Mapbox or future style APIs."}}
          data-wd-key="modal:settings.owner"
          value={(this.props.mapStyle as any).owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
        <FieldUrl
          fieldSpec={latest.$root.sprite}
          label="Sprite URL"
          data-wd-key="modal:settings.sprite"
          value={this.props.mapStyle.sprite as string}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />

        <FieldUrl
          label="Glyphs URL"
          fieldSpec={latest.$root.glyphs}
          data-wd-key="modal:settings.glyphs"
          value={this.props.mapStyle.glyphs as string}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />

        <FieldString
          label={fieldSpecAdditional.maputnik.maptiler_access_token.label}
          fieldSpec={fieldSpecAdditional.maputnik.maptiler_access_token}
          data-wd-key="modal:settings.maputnik:openmaptiles_access_token"
          value={metadata['maputnik:openmaptiles_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
        />

        <FieldString
          label={fieldSpecAdditional.maputnik.thunderforest_access_token.label}
          fieldSpec={fieldSpecAdditional.maputnik.thunderforest_access_token}
          data-wd-key="modal:settings.maputnik:thunderforest_access_token"
          value={metadata['maputnik:thunderforest_access_token']}
          onChange={onChangeMetadataProperty.bind(this, "maputnik:thunderforest_access_token")}
        />

        <FieldArray
          label={"Center"}
          fieldSpec={latest.$root.center}
          length={2}
          type="number"
          value={mapStyle.center || []}
          default={[0, 0]}
          onChange={this.changeStyleProperty.bind(this, "center")}
        />

        <FieldNumber
          label={"Zoom"}
          fieldSpec={latest.$root.zoom}
          value={mapStyle.zoom}
          default={0}
          onChange={this.changeStyleProperty.bind(this, "zoom")}
        />

        <FieldNumber
          label={"Bearing"}
          fieldSpec={latest.$root.bearing}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default}
          onChange={this.changeStyleProperty.bind(this, "bearing")}
        />

        <FieldNumber
          label={"Pitch"}
          fieldSpec={latest.$root.pitch}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default}
          onChange={this.changeStyleProperty.bind(this, "pitch")}
        />

        <FieldEnum
          label={"Light anchor"}
          fieldSpec={latest.light.anchor}
          name="light-anchor"
          value={light.anchor as string}
          options={Object.keys(latest.light.anchor.values)}
          default={latest.light.anchor.default}
          onChange={this.changeLightProperty.bind(this, "anchor")}
        />

        <FieldColor
          label={"Light color"}
          fieldSpec={latest.light.color}
          value={light.color as string}
          default={latest.light.color.default}
          onChange={this.changeLightProperty.bind(this, "color")}
        />

        <FieldNumber
          label={"Light intensity"}
          fieldSpec={latest.light.intensity}
          value={light.intensity as number}
          default={latest.light.intensity.default}
          onChange={this.changeLightProperty.bind(this, "intensity")}
        />

        <FieldArray
          label={"Light position"}
          fieldSpec={latest.light.position}
          type="number"
          length={latest.light.position.length}
          value={light.position as number[]}
          default={latest.light.position.default}
          onChange={this.changeLightProperty.bind(this, "position")}
        />

        <FieldString
          label={"Terrain source"}
          fieldSpec={latest.terrain.source}
          data-wd-key="modal:settings.maputnik:terrain_source"
          value={terrain.source}
          onChange={this.changeTerrainProperty.bind(this, "source")}
        />

        <FieldNumber
          label={"Terrain exaggeration"}
          fieldSpec={latest.terrain.exaggeration}
          value={terrain.exaggeration}
          default={latest.terrain.exaggeration.default}
          onChange={this.changeTerrainProperty.bind(this, "exaggeration")}
        />

        <FieldNumber
          label={"Transition delay"}
          fieldSpec={latest.transition.delay}
          value={transition.delay}
          default={latest.transition.delay.default}
          onChange={this.changeTransitionProperty.bind(this, "delay")}
        />

        <FieldNumber
          label={"Transition duration"}
          fieldSpec={latest.transition.duration}
          value={transition.duration}
          default={latest.transition.duration.default}
          onChange={this.changeTransitionProperty.bind(this, "duration")}
        />

        <FieldSelect
          label={fieldSpecAdditional.maputnik.style_renderer.label}
          fieldSpec={fieldSpecAdditional.maputnik.style_renderer}
          data-wd-key="modal:settings.maputnik:renderer"
          options={[
            ['mlgljs', 'MapLibreGL JS'],
            ['ol', 'Open Layers (experimental)'],
          ]}
          value={metadata['maputnik:renderer'] || 'mlgljs'}
          onChange={onChangeMetadataProperty.bind(this, 'maputnik:renderer')}
        />
      </div>
    </Modal>
  }
}

