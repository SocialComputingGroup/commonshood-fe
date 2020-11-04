
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Icon,Style,Circle,Stroke,Fill} from 'ol/style';
import icon from '../../assets/img/home-green.png';
import iconCenter from '../../assets/img/crosshairs-solid.svg';
import Text from 'ol/style/Text';
import Cluster from 'ol/source/Cluster';
import {defaults as defaultControls, Control} from 'ol/control';
import {transform} from 'ol/proj';
import axios from 'axios';
import GeoJSON from 'ol/format/GeoJSON';
import SimpleCard from './SimpleCard';
import moment from 'moment';
import 'ol/ol.css';
import { withStyles } from "@material-ui/core/styles";

import {logger} from '../../utilities/winstonLogging/winstonInit';
import config from '../../config';

const styles = {
  cards: {
    position: "fixed",
    bottom: "14px",
    background: "rgba(0, 60, 136, 0.2)",
    left: "10px",
    right: "10px",
    //width: "99%",
    borderRadius: "10px",
    zIndex: 1,
    //whiteSpace: "nowrap" 
  },
  cardContent: {
    border: "solid transparent",
    position: "relative",
    transform: "scale(0.98)",
    cursor: "pointer",
    overflowX: "scroll",
    whiteSpace: "nowrap",
    //width: "100vw",
    borderCollapse: "separate",
    borderSpacing: "10px",
    //marginLeft: "-16px",
    //display: "inline-flex",
    padding: "5px 0px 5px 5px",
    //background: "white"
  },

};

class MapComponent extends Component {
    constructor (props) {
        super(props);
        this.mapRef = null;
        this.olMap = null;
        this.currZoom = null;
        this.cardContent = [];
        this.currentCluster = null;
        this.state = {
          cards : null
        }
        this.setMapRef = element => {
          this.mapRef = element;
        }      
    }
    

    stringDivider(str, width, spaceReplacer) {
      if (str.length > width) {
        var p = width;
        while (p > 0 && (str[p] !== ' ' && str[p] !== '-')) {
          p--;
        }
        if (p > 0) {
          var left;
          if (str.substring(p, p + 1) === '-') {
            left = str.substring(0, p + 1);
          } else {
            left = str.substring(0, p);
          }
          var right = str.substring(p + 1);
          return left + spaceReplacer + this.stringDivider(right, width, spaceReplacer);
        }
      }
      return str;
    }

    api() {
      return axios.create({
        baseURL: config.network.firstLifeApi.url
      })
    }

    initialCard(allFeatures){
      if(allFeatures.length !== 0){
          var numberCard = 1;
          const listPop = [];
          for(let i=0; i<allFeatures.length; i++){
              listPop[i] = {
                  'id': allFeatures[i].id_,
                  'name': allFeatures[i].values_.name,
                  'type': allFeatures[i].values_.entity_type,
                  'img': (allFeatures[i].values_.images === null || allFeatures[i].values_.images.length === 0) ? icon : 'https://storage.firstlife.org/files/thumb/' + allFeatures[i].values_.images[0]._id,
                  'url': '',
                  'address': allFeatures[i].values_.address,
                  'date_from': (allFeatures[i].values_.valid_from === null) ? '' : moment(allFeatures[i].values_.valid_from).format('DD')+'/'+ moment(allFeatures[i].values_.valid_from).format('MM')+'/'+moment(allFeatures[i].values_.valid_from).format('YYYY'),
                  'date_to': (allFeatures[i].values_.valid_to === null) ? '' : moment(allFeatures[i].values_.valid_to).format('DD')+'/'+ moment(allFeatures[i].values_.valid_to).format('MM')+'/'+moment(allFeatures[i].values_.valid_to).format('YYYY'),
                  'numberCard': numberCard
              };
              numberCard++;
          }
  
         
          const listPropOrder = listPop.sort(function(a,b){
              if (a.last_activity > b.last_activity) {
                  return -1;
              }
              if (a.last_activity < b.last_activity) {
                  return 1;
              }
              // a deve essere uguale a b
              return 0;
          });
      
          for(let i=0; i<listPropOrder.length; i++){
              listPropOrder[i].numberCard = i+1;
          }

          this.cardContent = listPropOrder;
          this.setState({
            cards: this.cardContent.map((element, i) => {
              return (<SimpleCard feature= {element} key={i} size={this.cardContent.length} pay = {(contact) => this.props.pay(contact)}/>)
            })
          });
  
      }
      
  }
      
    render() {
        const styles = { height: '100%', width: '100%'}
        const { classes } = this.props;
        return(
            <div style={styles} ref={this.setMapRef}> <div className={classes.cards} ref="cards"><div className={classes.cardContent} ref="scroller">
            {this.state.cards}</div>
            </div></div>
           
        )
    }

    iconFeature(location,nome) {
      return new Feature ({
        geometry: new Point (location),
        name: nome
      })
    }

    iconStyle(nome) {
      return new Style ({
        image : new Icon ({
          src: icon,
          scale: 0.3
        }),
        text : new Text ({
          text : this.stringDivider(nome, 16, '\n'),
          textAlign: "end",
          offsetX: 14,
          textBaseline: "middle",
          font: "normal 12px/1 Arial",
          fill: new Fill({color: "#aa3300"})
        })
      })
    }

    clusterStyle() {
      return new Circle ({
          radius: 16,
          angle: Math.PI,
          stroke: new Stroke ({
              color: 'rgba(255,255,255,0.5)',
              width: 3
          }),
          fill: new Fill ({
            color: 'rgba(255,153,0,0.6)'
          })
      })
    }

    updateClusterStyle(feature,isCluster) {
      let strokeColor = isCluster ? "rgba(8,98,87,0.6)" : "rgba(255,255,255,0.5)"
      feature.setStyle(
        new Style({
            image: new Circle({
                radius: 16,
                angle: Math.PI,
                stroke: new Stroke({
                    color: strokeColor,
                    width: 3
                }),
                fill: new Fill({
                    color: 'rgba(255, 153, 0, 0.6)'
                })
            }),
            text: new Text({
                text: (feature.get('features').length).toString(),
                fill: new Fill({
                    color: '#fff'
                })
            })
        })
    )
    this.currentCluster = isCluster ? feature : null;
  };

  initScrollCard() {
    let isDown = false;
    let startX;
    let scrollLeft;
    let slider = this.refs.scroller;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });
  }


    componentWillUpdate(nextProps) {
      /*const mapView = this.olMap.getView();
      mapView.animate({
        center: nextProps.currentLocation,
        duration: 2000
      });
      let features = []
      let tempFeauture = {}
      nextProps.locations.forEach((location) => { 
        console.log("LOCATION",location)
        tempFeauture = this.iconFeature(location.coords,location.name)
        //tempFeauture.setStyle(this.iconStyle(location.name));
        features.push(tempFeauture);
        console.log("FEATURE",tempFeauture)
      });
      let vectorSource = new VectorSource({
        features: features
      });
      let clusterSource = new Cluster({
        distance: 60,
        source: vectorSource
      });
      let layer = new VectorLayer ({
        source: clusterSource,
        myKey: "cluster",
        zIndex: 2,
        style: (element) => {
          const size = element.get("features").length;
          let label = size.toString()
          let color = "#fff"
          console.log("ELEMENT",element)
          if (size === 1) {
            return this.iconStyle(element.values_.features[0].values_.name);
          } else {
            return new Style ({
              image: this.clusterStyle(),
              text: new Text ({
                text: label,
                fill: new Fill ({
                  color: color
                })
              })
            })
          }
        }
      });
      this.olMap.addLayer(layer)
      console.log("ZOOM",this.olMap.getView().getZoom())*/
     
    }

    componentDidMount() {
        const mapDOMNode = ReactDOM.findDOMNode(this.mapRef);
        let vectorSource = new VectorSource({
          format: new GeoJSON()
        });
        let clusterSource = new Cluster({
          distance: 60,
          source: vectorSource
        });
        let layer = new VectorLayer ({
          source: clusterSource,
          myKey: "cluster",
          zIndex: 2,
          style: (element) => {
            const size = element.get("features").length;
            let label = size.toString()
            let color = "#fff"

            if (size === 1) {
              return this.iconStyle(element.values_.features[0].values_.name);
            } else {
              return new Style ({
                image: this.clusterStyle(),
                text: new Text ({
                  text: label,
                  fill: new Fill ({
                    color: color
                  })
                })
              })
            }
          }
        });
        let myPosition = this.props.currentLocation;
        const CenterControl = /*@__PURE__*/(function (Control) {
          function CenterControl(opt_options) {
            let options = opt_options || {};
        
            let button = document.createElement('button');
            button.addEventListener("focus", function () {
              this.style.outline = "none";  
            });
            let img = document.createElement('IMG');
            img.setAttribute("src", iconCenter);
            button.appendChild(img);
        
            let element = document.createElement('div');
            element.style.cssText = "top: 5em; left: .5em;";
            element.className = 'ol-unselectable ol-control';
            element.appendChild(button);
        
            Control.call(this, {
              element: element,
              target: options.target
            });
        
            button.addEventListener('click', this.handleCenter.bind(this), false);
          }
        
          if ( Control ) CenterControl.__proto__ = Control;
          CenterControl.prototype = Object.create( Control && Control.prototype );
          CenterControl.prototype.constructor = CenterControl;
        
          CenterControl.prototype.handleCenter = function handleCenter () {
            this.getMap().getView().animate({
              center: myPosition,
              duration: 200
            });
          };
        
          return CenterControl;
        }(Control));

        this.olMap = new Map({
            target: mapDOMNode,
            controls: defaultControls().extend([
              new CenterControl()
            ]),
            layers: [
              new TileLayer({
                source: new OSM({
                  url: "https://devtiles.firstlife.org/styles/klokantech-basic/{z}/{x}/{y}.png",
                  attributions: ""
                })
              }),
              layer
            ],
            view: new View({
              center: this.props.placeToCenter ? this.props.placeToCenter :this.props.currentLocation,
              zoom: 14,
              enableRotation: false
            })
          });

          this.olMap.on('moveend', () => {
                const bbox = this.olMap.getView().calculateExtent(this.olMap.getSize());
                var sw = transform([bbox[2], bbox[3]], 'EPSG:3857', 'EPSG:4326');
                var ne = transform([bbox[0], bbox[1]], 'EPSG:3857', 'EPSG:4326');
                this.api().get("Things/boundingbox?domainId=35&limit=99999&ne_lat="+ne[1]+"&ne_lng="+ne[0]+"&sw_lat="+sw[1]+"&sw_lng="+sw[0]+"&types="+this.props.type)
                .then(
                    es => {
                        //logger.debug('AGAIN CALLED LOAD ENTITIES DRAW', es);
                        let allFeatures = [];
                        if (es.data.things.features.length) {
                            this.refs.cards.style.display = null
                            es.data.things.features.forEach(e => {
                                if(this.props.entities.filter(element => element.firstLifePlaceID === e._id).length > 0 || this.props.entities.filter(element => element.firsLifePointId === e._id).length > 0) { // is our dao or our crowdsale?
                                  const feat = vectorSource.getFormat().readFeature(e, { featureProjection: 'EPSG:3857' });
                                  feat.setId(e._id || e.id);
                                  allFeatures.push(feat);
                                }
                            });
                            this.initialCard(allFeatures);
                            vectorSource.addFeatures(allFeatures);
                            this.refs.scroller.scrollLeft-=10000000
                        }
                        if(allFeatures.length === 0) {
                          this.refs.cards.style.display = 'none';
                        }

                    },
                    err => {
                        logger.debug('Observer of loadEntitiesDraw got an error: ' + err)
                    });
                
                
            }
        );

          this.olMap.on('click', (event) => {
            this.olMap.forEachFeatureAtPixel(event.pixel, (feature,layer) => {
              logger.info("CLICK", feature.getProperties().features[0].values_.name);
              if(this.currentCluster) {
                  this.updateClusterStyle(this.currentCluster,false)
              }
              if(feature.getProperties().features.length > 1) {
                this.updateClusterStyle(feature,true)
                this.initialCard(feature.getProperties().features)
                this.refs.scroller.scrollLeft-=10000000
              } else {
                let feat = feature.getProperties().features[0];
                let contact = {
                  firstLifePlaceID: feat.id_,
                  realm: "dao",
                  icon: icon,
                  name: feat.values_.name
                };
                this.props.pay(contact);
              }
          });
            
          });

          this.initScrollCard();
    }

}

export default withStyles(styles)(MapComponent)