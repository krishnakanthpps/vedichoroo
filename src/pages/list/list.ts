import { Component } from '@angular/core';
import { Platform, NavController, NavParams, Events } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { ShareService } from '../../app/share.service'
import { PersonalDetailsPage } from '../personal-details/personal-details';
import { StarConstPage } from '../star-const/star-const';
import { LovehoroPage } from '../lovehoro/lovehoro';
import { AstrologersPage } from '../astrologers/astrologers';
import { StoriesPage } from '../stories/stories';
import {DailyForecastPage} from '../dailyforecast/dailyforecast';
import { PanchangPage } from '../panchang/panchang';
import { HoroscopeService } from '../../app/horoscope.service';
import { TranslateService } from '@ngx-translate/core';
//import * as lagnas from '../horoscope/lagna.json';
import * as sublords from '../horoscope/sublords.json';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  lang: string;
  icons: string[];
  title: string[];
  note: string[];
  items: Array<{title: string, note: string, icon: string}>;
  today: any = '';
  sunrise: string = '';
  sunset: string = '';
  rahukal: string = '';
  yama: string = '';
  abhjit: string = '';
  showCard: boolean;
  //fetching: string = '';
  lagna: string = '';
  ticks: number = 0;
  lag_d: number = 0;
  lag_m: number = 0;
  lag_s: number = 0;
  lagml: string = '';
  lagal: string = '';
  lagsl: string = '';
  nak: string = '';
  tithi: string = '';
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public horoService: HoroscopeService, public shareService: ShareService, public translate: TranslateService, public events: Events, private file: File) {
    this.translate.setDefaultLang('en');
    this.showCard = false;
    this.icons = ['planet', 'star', 'heart', 'flower', 'podium','body','sunny','paper', 'mic'];
	this.title = ['Birth Chart','Star Constellation', 'Love Horoscope', 'KP Astrology', 'Divisional Charts', 'Yogas In Your Horoscope', 'Daily Horoscope', 'Vedic Stories', 'Talk to Astrologer']
    this.note = ['Vedic Horoscope with Vimsottara Dasha predictions','Star Constellation As Per B V Raman', 'Love Compatibility Report', 'KP Astrology, Life Event Predictions', 'D-1/D-16 charts, Navamsa, Dasamsa, etc..','Raja Yogas, Panchmahapurush Yogas, Gajakesari Yoga, Lakshmi Yoga...', 'Based On Your Moon Sign', 'Vedic Astrology Stories', 'Ask a question or Talk instantly with our expert astrologers']
    this.items = [];
    for(let i = 1; i < 10; i++) {
      this.items.push({
        title: this.title[i-1],
        note: this.note[i-1],
        icon: this.icons[i-1] 
      });
    }
    this.today = Date.now();
  }
  ionViewDidLoad()
  {
   console.log('ioniViewDidLoad()');
   this.platform.ready().then(() => {
    console.log('listpage', 'platform ready!');	
	//this.events.subscribe('dbfetch:lang', (res) => {
		console.log('lang =' + this.shareService.getLANG());
		//if(res) {
			this.lang = this.shareService.getLANG();
		//} else {
			//this.lang = 'en';
		////}
		this.translate.use(this.lang);
	//});		
    console.log(this.file.dataDirectory);
	this.file.readAsText(this.file.dataDirectory, 'vedicperfs.json').then(res => {
		console.log('vedicperfs', res);
	    var jsonv = JSON.parse(res);
        this.sunrise = jsonv['srise'];
		this.sunset = jsonv['sset'];
        this.rahukal = jsonv['rahukal_s'] + ' To ' + jsonv['rahukal_e'];
        this.yama = jsonv['yamgand_s'] + ' To ' + jsonv['yamgand_e'];
        this.abhjit = jsonv['abhijit_s'] + ' To ' + jsonv['abhijit_e'];
		this.showCard = true;
  		var cd = new Date();
		this.horoService.getCusps(this.getDms(jsonv['clat']), this.getDms(jsonv['clat']), cd.getFullYear() + '-' + (cd.getMonth()+1).toString() + '-' + cd.getDate() + 'T' + cd.getHours() + ':' + cd.getMinutes(), jsonv['localtz'])
		   .subscribe(res3 => {
		   this.nak = this.translate_func(res3['birthStar']);
		   this.tithi = this.translate_func(res3['tithi']);
		   var ascPos = res3['ascPos'];
		   console.log(ascPos);
		   var lag = this.getDms(ascPos[0]);
		   console.log(lag);
		   this.lagna = lag;
		   console.log(lag.indexOf('º'));
		   this.lag_d = Number(lag.substring(0, lag.indexOf('º')));
		   console.log(this.lag_d);
		   this.lag_m = Number(lag.substring(lag.indexOf('º')+1,  lag.indexOf("'")));
		   console.log(this.lag_m);
		   this.lag_s = Math.floor(lag.substring(lag.indexOf("'")+1,  lag.indexOf('"')));
		   console.log(this.lag_s);
		   var c_mins = this.lag_d*60 + this.lag_m + Number((this.lag_s/60).toFixed(2));
		   console.log(c_mins);
		   let sssl: string = this.calcStar(c_mins);
		   console.log(sssl);
		   this.lagml = sssl.split('|')[0];
		   this.lagal = sssl.split('|')[1];
		   this.lagsl = sssl.split('|')[2];
		   var intv = setInterval(() =>  {
		    this.ticks++;
			//console.log('ticks=' + this.ticks.toString());
			this.lag_s += 15;
			if(this.lag_s > 59) {
				this.lag_s = this.lag_s -59;
				this.lag_m++;
				if(this.lag_m > 59) {
					this.lag_m = 0;
					this.lag_d++;
				}
			}
			let lag_r: string = '';
			if(this.lag_d < 29) lag_r = 'Aries';
			else if(this.lag_d < 59) lag_r = 'Taurus';
			else if(this.lag_d < 89) lag_r = 'Gemini';
			else if(this.lag_d < 119) lag_r = 'Cancer';
			else if(this.lag_d < 149) lag_r = 'Leo';
			else if(this.lag_d < 179) lag_r = 'Virgo';
			else if(this.lag_d < 209) lag_r = 'Libra';
			else if(this.lag_d < 239) lag_r = 'Scorpio';
			else if(this.lag_d < 269) lag_r = 'Sagittarius';
			else if(this.lag_d < 299) lag_r = 'Capricorn';
			else if(this.lag_d < 329) lag_r = 'Aquarius';
			else lag_r = 'Pisces';
			
			this.lagna = lag_r + ' ' + this.lag_d.toString() + 'º' + this.lag_m.toString() + "'" + this.lag_s.toString() + '"';
		   var cur_m = this.lag_d*60 + this.lag_m + Math.floor(this.lag_s/60);
		   //console.log(cur_m);
		   let sl: string = this.calcStar(cur_m);
		   this.lagml = sl.split('|')[0];
		   this.lagal = sl.split('|')[1];
		   this.lagsl = sl.split('|')[2];
			
			//let key: string = this.lag_d.toString() + '-' + this.lag_m.toString() + '-' + this.lag_s.toString();
			//this.lagna = this.lag_d.toString() + 'º' + this.lag_m.toString() + "'" + this.lag_s.toString() + '"';
			//this.lagml = lagnas[key].split('-')[0];
			//this.lagal = lagnas[key].split('-')[1];
			//this.lagsl = lagnas[key].split('-')[2];
					//if(this.lag_d == 360) {
						//this.lag_d = 0;
						//this.lag_m = 0;
						//this.lag_s = 0;
					//}
			
		   },1000);
		  }, (err) => {
		});
	  });	  
	});	  
  }
  calcStar(mins: number)
  {
		//console.log(mins);
		for(var i = 0; i < Object.keys(sublords).length; i++)
		{
			var nak = sublords[i];
			var degs = sublords[i].deg;
			var s_mins = parseInt(degs.split('-')[0].split('.')[0], 10)*60 + parseInt(degs.split('-')[0].split('.')[1]) + Number(degs.split('-')[0].split('.')[2])/60;
			var e_mins = parseInt(degs.split('-')[1].split('.')[0], 10)*60 + parseInt(degs.split('-')[1].split('.')[1]) + Number(degs.split('-')[1].split('.')[2])/60;
			//var deg_s = parseFloat(degs.split('-')[0].split('.')[0] + '.' + degs.split('-')[0].split('.')[1]);
			//var deg_e = parseFloat(degs.split('-')[1].split('.')[0] + '.' + degs.split('-')[1].split('.')[1]);
			//console.log(s_mins);
			//console.log(e_mins);
			if(mins >= s_mins && mins <= e_mins) {
			    //console.log(s_mins);
				//console.log(e_mins);
				return nak.sign + '|' + nak.star + '|' + nak.sub;
			}
		}
		return '-1';
  }
  
	getDms(val:any) {

        // Required variables
        var valDeg, valMin, valSec, result;

        // Here you'll convert the value received in the parameter to an absolute value.
        // Conversion of negative to positive.
        // In this step it does not matter if it's North, South, East or West,
        // such verification was performed earlier.
        val = Math.abs(val); // -40.601203 = 40.601203

        // ---- Degrees ----
        // Stores the integer of DD for the Degrees value in DMS
        valDeg = Math.floor(val); // 40.601203 = 40

        // Add the degrees value to the result by adding the degrees symbol "º".
        result = valDeg + "º"; // 40º

        // ---- Minutes ----
        // Removing the integer of the initial value you get the decimal portion.
        // Multiply the decimal portion by 60.
        // Math.floor returns an integer discarding the decimal portion.
        // ((40.601203 - 40 = 0.601203) * 60 = 36.07218) = 36
        valMin = Math.floor((val - valDeg) * 60); // 36.07218 = 36

        // Add minutes to the result, adding the symbol minutes "'".
        result += valMin + "'"; // 40º36'

        // ---- Seconds ----
        // To get the value in seconds is required:
        // 1º - removing the degree value to the initial value: 40 - 40.601203 = 0.601203;
        // 2º - convert the value minutes (36') in decimal ( valMin/60 = 0.6) so
        // you can subtract the previous value: 0.601203 - 0.6 = 0.001203;
        // 3º - now that you have the seconds value in decimal,
        // you need to convert it into seconds of degree.
        // To do so multiply this value (0.001203) by 3600, which is
        // the number of seconds in a degree.
        // You get 0.001203 * 3600 = 4.3308
        // As you are using the function Math.round(),
        // which rounds a value to the next unit,
        // you can control the number of decimal places
        // by multiplying by 1000 before Math.round
        // and subsequent division by 1000 after Math.round function.
        // You get 4.3308 * 1000 = 4330.8 -> Math.round = 4331 -> 4331 / 1000 = 4.331
        // In this case the final value will have three decimal places.
        // If you only want two decimal places
        // just replace the value 1000 by 100.
        valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000; // 40.601203 = 4.331 

        // Add the seconds value to the result,
        // adding the seconds symbol " " ".
        result += valSec + '"'; // 40º36'4.331"

        // Returns the resulting string.
        return result;
	}
  
calcTime(offset) {
var d = new Date();
var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
var nd = new Date(utc + (3600000*offset));

alert("The local time is " + nd.toLocaleString());
}
  itemTapped(event, item) {
   console.log(item.title);
   if(item.title == 'Birth Chart' || item.title == 'KP Astrology' || item.title == 'Divisional Charts') {
	 this.navCtrl.push(PersonalDetailsPage, {
      item: item
	  });
    } else if(item.title == 'Star Constellation') {
	 this.navCtrl.push(StarConstPage, {
      item: item
    });
	}else if(item.title == 'Yogas In Your Horoscope') {
	 this.navCtrl.push(PersonalDetailsPage, {
      item: item
	  });
	}else if(item.title == 'Love Horoscope') {
	 this.navCtrl.push(LovehoroPage, {
      item: item
    });
	} else if(item.title == 'Vedic Stories') {
	 this.navCtrl.push(StoriesPage, {
      item: item
    });
	} else if(item.title == 'Daily Horoscope') {
	  if(this.shareService.getMoonSign() == null) {
		 this.navCtrl.push(PersonalDetailsPage, {
		  item: item
		  });
	  } else {
		 this.navCtrl.push(DailyForecastPage, {
		  item: item
		  });
	  }
    } else if(item.title == 'Talk to Astrologer') {
		this.navCtrl.push(AstrologersPage, {
			item: item
		});
	}
  }
  viewPanchang()
  {
	this.navCtrl.push(PanchangPage);
  }
  switchLanguage() {
    this.translate.use(this.lang);
	console.log(this.lang);
	this.shareService.setLANG(this.lang);
  }
	translate_func(lord: string)
	{
	  if(this.shareService.getLANG() == 'en') return lord;
	  let trn: string = lord;
		switch(lord.toLowerCase())
		{
			case 'sun':
			case 'su':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సూర్యుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रवि ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சூரியன்';
				}
				break;
			case 'moon':
			case 'mo':
				if(this.shareService.getLANG() == 'te') {
					trn = 'చంద్రుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'चांद ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சந்திரன்';
				}
				break;
			case 'jupiter':
			case 'ju':
				if(this.shareService.getLANG() == 'te') {
					trn = 'బృహస్పతి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'बृहस्पति';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'குரு';
				}
				break;
			case 'mercury':
			case 'me':
				if(this.shareService.getLANG() == 'te') {
					trn = 'బుధుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'बुध गृह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'புதன்';
				}
				break;
			case 'mars':
			case 'ma':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కుజుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मंगल ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'செவ்வாய்';
				}
				break;
			case 'venus':
			case 've':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శుక్రుడు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'शुक्र ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சுக்கிரன்';
				}
				break;
			case 'saturn':
			case 'sa':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శనిగ్రహము';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'शनि ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சனி';
				}
				break;
			case 'rahu':
			case 'ra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'రాహు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'राहु ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'ராகு';
				}
				break;
			case 'ketu':
			case 'ke':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కేతు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'केतु ग्रह';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'கேது';
				}
				break;
			case 'aries':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మేషరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मेष राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'மேஷம்';
				}
				break;
			case 'taurus':
				if(this.shareService.getLANG() == 'te') {
					trn = 'వృషభరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'वृषभ राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'ரிஷபம்';
				}
				break;
			case 'gemini':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మిధునరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'மிதுனம்';
				}
				break;
			case 'cancer':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కర్కాటకరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कर्क राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'கடகம்';
				}
				break;
			case 'leo':
				if(this.shareService.getLANG() == 'te') {
					trn = 'సిమ్హరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'सिंह राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சிம்மம்';
				}
				break;
			case 'virgo':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కన్యరాశి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कन्या राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'கன்னி';
				}
				break;
			case 'libra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'తులారాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'तुला राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'துலாம்';
				}
				break;
			case 'scorpio':
				if(this.shareService.getLANG() == 'te') {
					trn = 'వృశ్చికరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'वृश्चिक राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'விருச்சிகம்';
				}
				break;
			case 'saggitarius':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ధనుస్సురాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'धनु राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'தனுசு';
				}
				break;
			case 'capricorn':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మకరరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'மகரம்';
				}
				break;
			case 'aquarius':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కుంభరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कुंभ राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'கும்பம்';
				}
				break;
			case 'pisces':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మీనరాసి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मीन राशि';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'மீனம்';
				}
				break;
			case 'ashwini':
				if(this.shareService.getLANG() == 'te') {
					trn = 'అశ్వినీ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अश्विनी';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'அஸ்வினி';
				}
				break;
			case 'bharani':
				if(this.shareService.getLANG() == 'te') {
					trn = 'భరణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'भरणी';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'பரணி';
				}
				break;
			case 'krittika':
				if(this.shareService.getLANG() == 'te') {
					trn = 'కృత్తికా';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'कृत्तिका';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'கிருத்திகை';
				}
				break;
			case 'rohini':
				if(this.shareService.getLANG() == 'te') {
					trn = 'రోహిణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रोहिणी';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'ரோகிணி';
				}
				break;
			case 'mrigashira':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మ్రిగశిర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मृगशिरा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'மிருகசிரீடம்';
				}
				break;
			case 'ardra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఆర్ద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'आर्द्र';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'திருவாதிரை';
				}
				break;
			case 'punarvasu':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పునర్వసు';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पुनर्वसु';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'புனர்பூசம்';
				}
				break;
			case 'pushya':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పుష్య';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पुष्य';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'பூசம்';
				}
				break;
			case 'ashlesha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఆశ్లేష';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अश्लेषा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'ஆயில்யம்';
				}
				break;
			case 'magha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మఘ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मघा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'மகம்';
				}
				break;
			case 'purvaphalguni':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్వఫల్గుణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्वाफाल्गुनी';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'பூரம்';
				}
				break;
			case 'uttaraaphalguni':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఉత్తరాఫల్గుణి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'उत्तराफाल्गुनी';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'உத்திரம்';
				}
				break;
			case 'hastha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'హస్త';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'हस्ता';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'அஸ்தம்';
				}
				break;
			case 'chitra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'చిత్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'चित्र';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சித்திரை';
				}
				break;
			case 'swati':
				if(this.shareService.getLANG() == 'te') {
					trn = 'స్వాతి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'स्वाति';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'ஸ்வாதி';
				}
				break;
			case 'vishakha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'విశాఖ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'विशाखा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'விசாகம்';
				}
				break;
			case 'anuradha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'అనురాధ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'अनुराधा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'அனுஷம்';
				}
				break;
			case 'jyestha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'జ్యేష్ఠా';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'जयस्था';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'கேட்டை';
				}
				break;
			case 'mula':
				if(this.shareService.getLANG() == 'te') {
					trn = 'మూల';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'मूल';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'மூலம்';
				}
				break;
			case 'purvaashada':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్వాషాఢ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्वाषाढ़ा';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'பூராடம்';
				}
				break;
			case 'uttaraashada':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఉత్తరాషాఢ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'उत्तराषाढ़ा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'உத்திராடம்';
				}
				break;
			case 'shravana':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శ్రావణ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'श्रवण';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'திருவோணம்';
				}
				break;
			case 'danishta':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ధనిష్ఠ';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'धनिष्ठा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'அவிட்டம்';
				}
				break;
			case 'shatabhisha':
				if(this.shareService.getLANG() == 'te') {
					trn = 'శతభిషా';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'शतभिषा';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'சதயம்';
				}
				break;
			case 'purvabhadra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'పూర్వాభాద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'पूर्वभाद्र';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'பூரட்டாதி';
				}
				break;
			case 'uttarabhadra':
				if(this.shareService.getLANG() == 'te') {
					trn = 'ఉత్తరాభాద్ర';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'உத்திரட்டாதி';
				}
				break;
			case 'revati':
				if(this.shareService.getLANG() == 'te') {
					trn = 'రేవతి';
				} else if(this.shareService.getLANG() == 'hi') { 
					trn = 'रेवती';
				} else if(this.shareService.getLANG() == 'ta') { 
					trn = 'ரேவதி';
				}
				break;
			default:
				trn = lord;
				break;
		}
		return trn;
	}
  
}
