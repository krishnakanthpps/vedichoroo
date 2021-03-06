import { Component, Renderer2, AfterViewInit, ViewChild, ElementRef, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AppRate } from '@ionic-native/app-rate';
import { HoroscopeService } from '../../app/horoscope.service';
import { ShareService } from '../../app/share.service'
import { ChartAnalysisPage } from '../chart-analysis/chart-analysis'
import * as signs from '../horoscope/signs.json';
import * as o_signs from '../horoscope/o_signs.json'
import * as rashis from '../horoscope/rashis.json';
import * as o_rashis from '../horoscope/o_rashis.json';

/**
 * Generated class for the DivchartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@NgModule({
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

@Component({
  selector: 'page-divcharts',
  templateUrl: 'divcharts.html',
})
export class DivchartsPage {
  @ViewChild('divChart') divChart;
  device_width :number = 0;
  device_height :number = 0;
  chartanls: string = '';
  chart: any;
  asc_sign: string = '';
  lstnr_D1: Function; lstnr_D2: Function; lstnr_D3: Function; lstnr_D4: Function; lstnr_D7: Function; lstnr_D9: Function; lstnr_D10: Function; lstnr_D12: Function; lstnr_D16: Function; lstnr_D20: Function; lstnr_D24: Function; lstnr_D27: Function; lstnr_D30: Function; lstnr_D40: Function; lstnr_D45: Function; lstnr_D60: Function;
  
  constructor(platform: Platform, public navCtrl: NavController, public navParams: NavParams, private appRate: AppRate, public shareService: ShareService, private horoService: HoroscopeService, public renderer: Renderer2) {
  platform.ready().then(() => {
		console.log('Width: ' + platform.width());
		this.device_width = platform.width();
		console.log('Height: ' + platform.height());
		this.device_height = platform.height();
  this.appRate.preferences = {
        displayAppName: '126 Astrology',
        usesUntilPrompt: 2,
		simpleMode: true,
        promptAgainForEachNewVersion: false,
        storeAppURL: {
          ios: '1216856883',
          android: 'market://details?id=com.mypubz.eportal'
        },
        customLocale: {
          title: 'Do you enjoy %@?',
          message: 'If you enjoy using %@, would you mind taking a moment to rate it? Thanks so much!',
          cancelButtonLabel: 'No, Thanks',
          laterButtonLabel: 'Remind Me Later',
          rateButtonLabel: 'Rate It Now',
		  yesButtonLabel: 'Yes!',
          noButtonLabel: 'No!'		  
        },
        callbacks: {
          onRateDialogShow: function(callback){
            console.log('rate dialog shown!');
          },
          onButtonClicked: function(buttonIndex){
            console.log('Selected index: -> ' + buttonIndex);
          }
        }
      };
        // Opens the rating immediately no matter what preferences you set
     this.appRate.promptForRating(true);
	 this.updateNodePos();
	 this.chart = "1";
	 //this.calcDivChart(Number(this.chart));
	 this.loadHoro(this.shareService.getPLPOS(), this.divChart.nativeElement, 'RASHI', 'D1');
	 let oP: string[] = [];
	 oP = this.calcHoraChart()
	 this.loadHoro(oP, this.divChart.nativeElement, 'HORA', 'D2');
	 oP = this.calcDivChart(3)
	 this.loadHoro(oP, this.divChart.nativeElement, 'DRESHKANA', 'D3');
	 oP = this.calcDivChart(4)
	 this.loadHoro(oP, this.divChart.nativeElement, 'CHATHURTHAMSA', 'D4');
	 oP = this.calcDivChart(7)
	 this.loadHoro(oP, this.divChart.nativeElement, 'SAPTAMSA', 'D7');
	 oP = this.calcDivChart(9)
	 this.loadHoro(oP, this.divChart.nativeElement, 'NAVAMSA', 'D9');
	 oP = this.calcDivChart(10)
	 this.loadHoro(oP, this.divChart.nativeElement, 'DASAMSA', 'D10');
	 oP = this.calcDivChart(12)
	 this.loadHoro(oP, this.divChart.nativeElement, 'DWADASAMSA', 'D12');
	 oP = this.calcDivChart(16)
	 this.loadHoro(oP, this.divChart.nativeElement, 'SHODASAMSA', 'D16');
	 oP = this.calcDivChart(20)
	 this.loadHoro(oP, this.divChart.nativeElement, 'VIMSAMSA', 'D20');
	 oP = this.calcDivChart(24)
	 this.loadHoro(oP, this.divChart.nativeElement, 'CHATURVIMSAMSA', 'D24');
	 oP = this.calcDivChart(27)
	 this.loadHoro(oP, this.divChart.nativeElement, 'SAPTAVIMSAMSA', 'D27');
	 oP = this.calcDivChart(30)
	 this.loadHoro(oP, this.divChart.nativeElement, 'TRIMASAMSA', 'D30');
	 oP = this.calcDivChart(40)
	 this.loadHoro(oP, this.divChart.nativeElement, 'KHAVEDAMSA', 'D40');
	 oP = this.calcDivChart(45)
	 this.loadHoro(oP, this.divChart.nativeElement, 'AKSHAVEDAMSA', 'D45');
	 oP = this.calcDivChart(60)
	 this.loadHoro(oP, this.divChart.nativeElement, 'SHASTAMSA', 'D60');
	  if(this.shareService.getLANG() == 'en') {
		this.chartanls =  '<span> TAP on each chart to reveal more information</span>';
	  } else if(this.shareService.getLANG() == 'te') {
		this.chartanls = 'మరిన్ని వివరాలకు చార్ట్ ని ట్టాప్ చేయండి' ;
	  } else if(this.shareService.getLANG() == 'hi') {
	    this.chartanls = 'अधिक जानकारी के लिए प्रत्येक चार्ट पर टैप करें';
	  } else if(this.shareService.getLANG() == 'ta') {
	    this.chartanls = 'ஒவ்வொரு விளக்கப்படத்தையும் மேலும் வெளிப்படுத்த';
	  }
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DivchartsPage');
  }
  ngOnDestroy() {
    this.lstnr_D1();
    this.lstnr_D2();
    this.lstnr_D3();
    this.lstnr_D4();
    this.lstnr_D9();
    this.lstnr_D10();
    this.lstnr_D12();
    this.lstnr_D16();
    this.lstnr_D20();
    this.lstnr_D24();
    this.lstnr_D27();
    this.lstnr_D30();
    this.lstnr_D40();
    this.lstnr_D45();
    this.lstnr_D60();
  }	
  calcHoraChart()
  {
	let navPls: string[] = [];
	var plPos = this.shareService.getPLPOS();
	var sgns = ["ar","ta","ge","cn","le","vi","li","sc","sa","cp","aq","pi"];
	for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
		let hora_sign: string = '';
		if (plPos.hasOwnProperty(sign)) {
			var pls = plPos[sign].split('\|');
			for (var k = 0; k < pls.length; k++) {
			   console.log('pl=' + pls[k]);
				var pl = pls[k].split(' ')[1];
				if (pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'TRUE_NODE') {  //consider only true planets
				    let po: number = Number(pls[k].split(' ')[0]);
					switch(sign)
					{
						case 'ar':
						case 'ge':
						case 'le':
						case 'li':
						case 'sa':
						case 'aq':
						    (po <= 15) ? hora_sign = 'le' : hora_sign = 'cn';
							break;
						case 'ta':
						case 'cn':
						case 'vi':
						case 'sc':
						case 'cp':
						case 'pi':
						    (po <= 15) ? hora_sign = 'cn' : hora_sign = 'le';
							break;
						default:
							break;
					}
				    if(!navPls.hasOwnProperty(hora_sign))
						navPls[hora_sign] = pls[k];
					else
						navPls[hora_sign] += '|' + pls[k];
				}
			}
		}
	}
	return navPls;
  }
  calcDivChart(ndivs)
  {
	let navPls: string[] = [];
    console.log('calcDivChart' + ndivs.toString());
	let sec: number = 30/ndivs, secp: number = 0;
	console.log('no. of divs=' + sec.toString());
	var plPos = this.shareService.getPLPOS();
	var sgns = ["ar","ta","ge","cn","le","vi","li","sc","sa","cp","aq","pi"];
	var divs = [];
	let n: number = 1;
	while((secp = sec*n++) <= 30) {
		  divs.push(secp);
	}
	console.log('part complete..');
	console.log(divs);
	for (var i = 0; i < 12; i++) {
		var sign = sgns[i];
		if (plPos.hasOwnProperty(sign)) {
			var pls = plPos[sign].split('\|');
			for (var k = 0; k < pls.length; k++) {
			   console.log('pl=' + pls[k]);
				var pl = pls[k].split(' ')[1];
				//if (pl != 'Ur' && pl != 'Pl' && pl != 'me' && pl != 'os' && pl != 'Ne' && pl != 'TRUE_NODE') {  //consider only true planets
				if(pl == 'AC') 	this.asc_sign = sign;
					let po: number = Number(pls[k].split(' ')[0]);
					console.log(sign);
					console.log(pl);
					console.log(po);
					let spos: number;
					n = 0;
					for(var dp = 0;  dp < Object.keys(divs).length; dp++)
					{
						if(po >= n && po <= divs[dp]) spos = dp+1;
						n = divs[dp];
					}
					while(spos > 12 ) spos -= 12;
					console.log('spos=' + spos.toString());
					let sord: number;
					let spnt: number = ndivs, x: number = 1;
					console.log('spnt=',ndivs+1);
					switch(sign)
					{
					  case 'ar':
						sord = 1;
						break;
					  case 'ta':
					    spnt = ndivs+1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'ge':
					    spnt = 2*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'cn':
					    spnt = 3*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'le':
					    spnt = 4*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'vi':
					    spnt = 5*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'li':
					    spnt = 6*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'sc':
					    spnt = 7*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'sa':
					    spnt = 8*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'cp':
					    spnt = 9*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'aq':
					    spnt = 10*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  case 'pi':
					    spnt = 11*ndivs + 1;
					    while(spnt > 12 ) spnt -= 12;
						sord = spnt;
						break;
					  default:
						break;
					}
					console.log('sord=' + sord.toString());
				//}
				let navp :number = sord + (spos-1);
				navp = (navp > 12) ? navp - 12: navp;
				console.log(navp);
				switch(navp)
				{
				  case 1:
				    if(!navPls.hasOwnProperty('ar'))
						navPls['ar'] = pls[k];
					else
						navPls['ar'] += '|' + pls[k];
				    break;
				  case 2:
				    if(!navPls.hasOwnProperty('ta'))
						navPls['ta'] = pls[k];
					else
						navPls['ta'] += '|' + pls[k];
				    break;
				  case 3:
				    if(!navPls.hasOwnProperty('ge'))
						navPls['ge'] = pls[k];
					else
						navPls['ge'] += '|' + pls[k];
					
				    break;
				  case 4:
				    if(!navPls.hasOwnProperty('cn'))
						navPls['cn']=pls[k];
					else
						navPls['cn'] += '|' + pls[k];
				    break;
				  case 5:
				    if(!navPls.hasOwnProperty('le'))
						navPls['le'] = pls[k];
					else
						navPls['le'] += '|' + pls[k];
				    break;
				  case 6:
				    if(!navPls.hasOwnProperty('vi'))
						navPls['vi']=pls[k];
					else
						navPls['vi'] += '|' + pls[k];
				    break;
				  case 7:
				    if(!navPls.hasOwnProperty('li'))
						navPls['li']=pls[k];
					else
						navPls['li'] += '|' + pls[k];
				    break;
				  case 8:
				    if(!navPls.hasOwnProperty('sc'))
						navPls['sc']=pls[k];
					else
						navPls['sc'] += '|' + pls[k];
				    break;
				  case 9:
				    if(!navPls.hasOwnProperty('sa'))
						navPls['sa']=pls[k];
					else
						navPls['sa'] += '|' + pls[k];
				    break;
				  case 10:
				    if(!navPls.hasOwnProperty('cp'))
						navPls['cp']=pls[k];
					else
						navPls['cp'] += '|' + pls[k];
				    break;
				  case 11:
				    if(!navPls.hasOwnProperty('aq'))
						navPls['aq'] = pls[k];
					else
						navPls['aq'] += '|' + pls[k];
				    break;
				  case 12:
				    if(!navPls.hasOwnProperty('pi'))
						navPls['pi']=pls[k];
					else
						navPls['pi'] += '|' + pls[k];
				    break;
				  default:
				    break;
				}
				console.log(navPls);
			}
		}
	}
	return navPls;
  }
  updateNodePos() {
	var plPos = this.shareService.getPLPOS();
   		for (var i = 0; i < 16; i++) {
			var sign = signs[i];
			if (plPos.hasOwnProperty(sign)) {
			    
				var pls = plPos[sign].split('\|');
				for (var k = 0; k < pls.length; k++) {
					if (pls[k].split(' ')[1] == 'MEAN_NODE') {
						var rpos = o_rashis[sign].split('\|')[0];
						var kpos = parseInt(rpos, 10) + 6;
						if (kpos > 12) kpos = (kpos - 12);
						if (plPos.hasOwnProperty(o_signs[kpos - 1])) {
							var eP = plPos[o_signs[kpos - 1]];
							plPos[o_signs[kpos - 1]] = eP + '|' + pls[k].split(' ')[0] + ' ' + 'Ke';
						} else {
							plPos[o_signs[kpos - 1]] = pls[k].split(' ')[0] + ' ' + 'Ke';
						}
						plPos[sign] = plPos[sign].replace('MEAN_NODE', 'Ra');
					} else if (pls[k].split(' ')[1] == 'AC') { 
						this.asc_sign = sign;
						//this.asc_deg = Number(pls[k].split(' ')[0]);
						console.log('ASCENDENT is ' + this.asc_sign);
					}
				}
			}
		}
	}
	updateAsc(plPos)
	{
   		for (var i = 0; i < 16; i++) {
			var sign = signs[i];
			if (plPos.hasOwnProperty(sign)) {
			    
				var pls = plPos[sign].split('\|');
				for (var k = 0; k < pls.length; k++) {
					if (pls[k].split(' ')[1] == 'AC') { 
						this.asc_sign = sign;
						//this.asc_deg = Number(pls[k].split(' ')[0]);
						console.log('ASCENDENT is ' + this.asc_sign);
					}
				}
			}
		}
	
	}
  loadHoro(plPos, ele, title, id)
  {
    //console.log('loadHoro' + title);
	//console.log(plPos);
	//var plPos = this.shareService.getPLPOS();
	//const dv = this.renderer.createElement('div');
	//this.renderer.setProperty(dv, 'id', id);
	//this.renderer.setStyle(dv, 'float', 'left');
	//this.renderer.addClass(dv, 'divchart');
	this.updateAsc(plPos);
	this.renderer.appendChild(ele, this.grid(4, this.device_width/8, this.device_width/2, plPos, title,  id));
	//this.renderer.appendChild(ele, dv);
	//this['lstnr_' + id] = this.renderer.listen(dv, 'click', this.logElement);

  }
  grid(numberPerSide, size, pixelsPerSide, plps, title, id) {
  		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.renderer.setAttribute(svg, "width", pixelsPerSide);
		this.renderer.setAttribute(svg, "height", pixelsPerSide);
		this.renderer.setProperty(svg, "id", id);
		//this.renderer.setAttribute(svg, "stroke", "#000000");
		//this.renderer.setAttribute(svg, "stroke-width", "3");
		//this.renderer.setAttribute(svg, "fill", "none");
	
		this.renderer.setAttribute(svg, "viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));
		var border = 1;
		var s2 = size * 2;
		var s3 = size;
		var s4 = 12;
		var s5 = size * 2 / 2;
		for (var i = 0; i < numberPerSide; i++) {
			for (var j = 0; j < numberPerSide; j++) {
				if ((i * numberPerSide + j) == 5 || (i * numberPerSide + j) == 6 || (i * numberPerSide + j) == 9 || (i * numberPerSide + j) == 10) {
					if ((i * numberPerSide + j) == 5) {
						var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
						this.renderer.setAttribute(g, "transform", ["translate(", i * size, ",", j * size, ")"].join(""));
						var number = numberPerSide * i + j;
						var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
						this.renderer.setAttribute(box, "width", s2.toString());
						this.renderer.setAttribute(box, "height", s2.toString());
						this.renderer.setAttribute(box, "border", border.toString());
						this.renderer.setAttribute(box, "stroke", "black");
						this.renderer.setAttribute(box, "fill", "#ffffff");//"#f4a460");
						this.renderer.setAttribute(box, "id", "b" + number);
						this.renderer.appendChild(g, box);
						var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.renderer.appendChild(text, document.createTextNode(title.toUpperCase()));
						this.renderer.setAttribute(text, "fill", "#000000");
						this.renderer.setAttribute(text, "font-size", (title.length > 10) ? (10).toString() : s4.toString());
						this.renderer.setAttribute(text, "font-weight", 'bold');
						this.renderer.setAttribute(text, "x", s3.toString());
						this.renderer.setAttribute(text, "y", s3.toString());
						this.renderer.setAttribute(text, "alignment-baseline", "middle");
						this.renderer.setAttribute(text, "text-anchor", "middle");
						this.renderer.setAttribute(text, "id", "t" + number);
						g.appendChild(text);
						svg.appendChild(g);
					}
					continue;
				}
				// var zodiac1 = zodiacs[(i + j) % zodiacs.length];
				// var zodiac2 = zodiacs[(i + j + 1) % zodiacs.length];
				g = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.renderer.setAttribute(g, "transform", ["translate(", i * size, ",", j * size, ")"].join(""));
				number = numberPerSide * i + j;
				box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				//var sign = "url(#sign-" + number.toString() + ")";
				this.renderer.setAttribute(box, "width", size.toString());
				this.renderer.setAttribute(box, "height", size.toString());
				//this.renderer.setAttribute(box, "border", border.toString());
				this.renderer.setAttribute(box, "stroke", (signs[number] == this.asc_sign) ? "#FF5733" : "#000000");
				this.renderer.setAttribute(box, "stroke-width", (signs[number] == this.asc_sign) ? (border+2).toString() : border.toString());
				this.renderer.setAttribute(box, "fill", "none");
				this.renderer.setAttribute(box, "id", "b" + number.toString());
				this.renderer.appendChild(g, box);
				var sign = signs[number];
				if (plps.hasOwnProperty(sign)) {
					//var pls = replaceAll(plps[sign], '\|', '');
					//var pls = plps[sign].replace(/\|/g, ' ');
					var pls = plps[sign].split('\|');
					var pcnt = 0;
					var s6 = 10;
					var s7 = 5;
					
					for (var k = 0; k < pls.length; k++) {
						if (pls[k].split(' ')[1] == 'me' || pls[k].split(' ')[1] == 'os') continue;
						//if (pls[k].split(' ')[1] == 'AC') this.asc_sign = sign;
						else if (pls[k].split(' ')[1] == 'Mo') {
//							this.moon_sign = sign;
//							this.moon_deg = Number(pls[k].split(' ')[0]);
						}
						pcnt++;
						text = document.createElementNS("http://www.w3.org/2000/svg", "text");
						this.renderer.appendChild(text, document.createTextNode(pls[k]));
						//text.setAttribute("fill", zodiac2);
						this.renderer.setAttribute(text, "font-size", s6.toString());
						this.renderer.setAttribute(text, "font-weight", "bold");
						if(pls[k].split(' ')[1] == 'AC') this.renderer.addClass(text, "redText");
						else if(pls[k].split(' ')[1] == 'Mo') this.renderer.addClass(text, "blueText");
						this.renderer.setAttribute(text, "x", s7.toString());
						var s8 = 10 * pcnt;
						this.renderer.setAttribute(text, "y",  s8.toString());
						this.renderer.setAttribute(text, "id", "t" + number.toString());
						g.appendChild(text);
					}
				}
				svg.appendChild(g);
			}
		}
		g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.renderer.setAttribute(g, "transform", ["translate(", i * size, ",", j * size, ")"].join(""));
		box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		this.renderer.setAttribute(box, "width", size.toString());
		this.renderer.setAttribute(box, "height", size.toString());
		this.renderer.setAttribute(box, "stroke", "#000000");
		this.renderer.setAttribute(box, "stroke-width", "4");
		this.renderer.setAttribute(box, "fill", "none");
		g.appendChild(box);
		svg.appendChild(g);
		number = numberPerSide * i + j;
	  this['lstnr_' + id] = this.renderer.listen(svg, 'click', (event) => {
			// Do something with 'event'
			console.log('clicked ', event.path);
			console.log('clicked ', event.path[2]);
			this.navCtrl.push(ChartAnalysisPage, {ID: event.path[2].id});
		});
		return svg;
	};
	logElement({target}) {
      if(target) {
      console.log('Target: ', target);
      // Add Business Logic here
    }
  }
}
