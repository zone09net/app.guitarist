import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import * as ChordsGuitar from './ChordsGuitar.js';
import * as ChordsUkulele from './ChordsUkulele.js';
import Tone from '@extlib/tone';
import {Assets} from './Assets.js'
import {Tab} from './tab/components/Tab.js';
import {Stringed} from './instruments/components/Stringed.js';
import {IFretboard} from './instruments/interfaces/IFretboard.js';



export interface IRootAttributes
{
	palette?: {
		black?: string,
		grey0?: string,
		grey1?: string,
		grey2?: string,
		grey3?: string,
		grey4?: string,
		grey5?: string,
		pink?: string,
		blue?: string,
		orange?: string,
		green?: string,
		yellow?: string,
		purple?: string,
		cyan?: string,
		red?: string
	},

	font?: {
		frets?: string,
	},

	tab?: {
		guitar?: {
			stringno: number,
			strokecolor?: string,
		},
		ukulele?: {
			stringno: number,
			strokecolor?: string,
		}
	}
}

export class Guitarist 
{
	private _attributes: IRootAttributes;
	private _context: Paperless.Context;
	private _assets: Assets;
	private _tab: Tab;
	private _stringed: Stringed;
	//private _wss: Foundation.WebSocketSecure;
	//---

	public constructor(attributes: IRootAttributes = {})
	{
		this._context = new Paperless.Context({
			autosize: true, 
			scale: 1, 
			dragging: {
			//	delay: 0,
			}
		});

		const {
			palette = {
				black: '#000000',
				grey0: '#151515',
				grey1: '#1a1a1a',
				grey2: '#444444',
				grey3: '#9a9a9a',
				grey4: '#101010',
				grey5: '#0b0b0b',
				pink: '#815556',
				blue: '#436665',
				orange: '#9a6c27',
				green: '#769050',
				yellow: '#c8af55',
				purple: '#434466',
				cyan: '#227a85',
				red: '#6e2020',
			},

			font = {
				frets: '13px impact',
			},
		} = attributes

		const FretboardGuitar: IFretboard = {
			...{
				name: 'guitar',
				artwork: '/assets/app.guitarist/guitar.png',
				colors: ['#c8af55', '#885D94', '#9a6c27',  '#436665','#815556', '#769050', '#595B8B'],
				notes: {
					x: [1442, 1368, 1263, 1168, 1074, 987, 906, 829, 756, 686, 620, 558, 501, 446, 393, 344, 298, 254, 212, 173, 136],
					y: {
						sequence: [297, 316],
						controls: [112, 91],
						E4: [257, 276],
						B3: [236, 247],
						G3: [215, 218],
						D3: [194, 189],
						A2: [173, 158],
						E2: [152, 131]
					}
				},
				caged: {
					notes: ['C', 'A', 'G', 'E', 'D'],
					jump: {
						C: [0, 3], A: [1, 2], G: [2, 3], E: [3, 2], D: [4, 2]
					},
					iteration: 8
				},
				tuners: {
					E4: [1547, 329],
					B3: [1651, 331],
					G3: [1753, 338],
					D3: [1757, 66],
					A2: [1652, 69],
					E2: [1550, 73]
				},
				tunings: {
					'custom': {E4: 'E4', B3: 'B3', G3: 'G3', D3: 'D3', A2: 'A2', E2: 'E2'},
					'standard': {E4: 'E4', B3: 'B3', G3: 'G3', D3: 'D3', A2: 'A2', E2: 'E2'},
					'drop D': {E4: 'E4', B3: 'B3', G3: 'G3', D3: 'D3', A2: 'A2', E2: 'D2'},
					'drop D flat': { E4: 'Eb4', B3: 'Bb3', G3: 'Gb3', D3: 'Db3', A2: 'Ab2', E2: 'Db2'},
					'drop C': {E4: 'D4', B3: 'A3', G3: 'F3', D3: 'C3', A2: 'F2', E2: 'C2'},
					'half step down': {E4: 'Eb4', B3: 'Bb3', G3: 'Gb3', D3: 'Db3', A2: 'Ab2', E2: 'Eb2'},
					'full step down': {E4: 'D4', B3: 'A3', G3: 'F3', D3: 'C3', A2: 'G2', E2: 'D2'},
				},
				tone: {
					urls: {
						/*'A0': 'A0.mp3', 'A1': 'A1.mp3',*/ 'A2': 'A2.mp3', 'A4': 'A4.mp3', /*'A6': 'A6.mp3', 'A7': 'A7.mp3',*/
						/*'B0': 'B0.mp3', 'B1': 'B1.mp3',*/ 'B3': 'B3.mp3', 'B4': 'B4.mp3', /*'B6': 'B6.mp3', 'B7': 'B7.mp3',*/
						/*'C1': 'C1.mp3', 'C2': 'C2.mp3',*/ 'C3': 'C3.mp3', 'C5': 'C5.mp3', /*'C7': 'C7.mp3', 'C8': 'C8.mp3',*/
						/*'D1': 'D1.mp3', 'D2': 'D2.mp3',*/ 'D3': 'D3.mp3', 'D4': 'D4.mp3', 'D5': 'D5.mp3', /*'D6': 'D6.mp3', 'D7': 'D7.mp3',*/
						/*'E1': 'E1.mp3',*/ /*'E2': 'E2.mp3',*/ 'E4': 'E4.mp3', 'E5': 'E5.mp3', /*'E6': 'E6.mp3', 'E7': 'E7.mp3',*/
						/*'F1': 'F1.mp3',*//* 'F2': 'F2.mp3',*/ 'F3': 'F3.mp3',  /*'F6': 'F6.mp3', 'F7': 'F7.mp3',*/
						/*'G1': 'G1.mp3',*/ 'G2': 'G2.mp3', 'G3': 'G3.mp3', /*'G6': 'G6.mp3', 'G7': 'G7.mp3',*/
						/*'Ab1': 'Ab1.mp3',*/ 'Ab3': 'Ab3.mp3', 'Ab5': 'Ab5.mp3', /*'Ab6': 'Ab6.mp3', 'Ab7': 'Ab7.mp3',*/
						/*'Bb0': 'Bb0.mp3', 'Bb1': 'Bb1.mp3',*/ 'Bb2': 'Bb2.mp3', 'Bb3': 'Bb3.mp3',  /*'Bb6': 'Bb6.mp3', 'Bb7': 'Bb7.mp3',*/
						/*'Db1': 'Db1.mp3', 'Db2': 'Db2.mp3',*/  /*'Db6': 'Db6.mp3', 'Db7': 'Db7.mp3',*/
						/*'Eb1': 'Eb1.mp3', 'Eb2': 'Eb2.mp3',*/ 'Eb3': 'Eb3.mp3',  /*'Eb6': 'Eb6.mp3', 'Eb7': 'Eb7.mp3',*/
						/*'Gb1': 'Gb1.mp3',*/ 'Gb5': 'Gb5.mp3', /*'Gb6': 'Gb6.mp3', 'Gb7': 'Gb7.mp3',*/
					},
					baseUrl: "/assets/app.guitarist/samples/guitar/",
					
					//urls: {
					//	/*'A0': 'A0.mp3', 'A1': 'A1.mp3',*/ 'A2': 'A2.mp3', 'A3': 'A3.mp3', 'A4': 'A4.mp3', 'A5': 'A5.mp3', /*'A6': 'A6.mp3', 'A7': 'A7.mp3',*/
					//	/*'B0': 'B0.mp3', 'B1': 'B1.mp3',*/ 'B2': 'B2.mp3', 'B3': 'B3.mp3', 'B4': 'B4.mp3', 'B5': 'B5.mp3', /*'B6': 'B6.mp3', 'B7': 'B7.mp3',*/
					//	/*'C1': 'C1.mp3', 'C2': 'C2.mp3',*/ 'C3': 'C3.mp3', 'C4': 'C4.mp3', 'C5': 'C5.mp3', 'C6': 'C6.mp3', /*'C7': 'C7.mp3', 'C8': 'C8.mp3',*/
					//	/*'D1': 'D1.mp3', 'D2': 'D2.mp3',*/ 'D3': 'D3.mp3', 'D4': 'D4.mp3', 'D5': 'D5.mp3', /*'D6': 'D6.mp3', 'D7': 'D7.mp3',*/
					//	/*'E1': 'E1.mp3',*/ 'E2': 'E2.mp3', 'E3': 'E3.mp3', 'E4': 'E4.mp3', 'E5': 'E5.mp3', /*'E6': 'E6.mp3', 'E7': 'E7.mp3',*/
					//	/*'F1': 'F1.mp3',*/ 'F2': 'F2.mp3', 'F3': 'F3.mp3', 'F4': 'F4.mp3', 'F5': 'F5.mp3', /*'F6': 'F6.mp3', 'F7': 'F7.mp3',*/
					//	/*'G1': 'G1.mp3',*/ 'G2': 'G2.mp3', 'G3': 'G3.mp3', 'G4': 'G4.mp3', 'G5': 'G5.mp3', /*'G6': 'G6.mp3', 'G7': 'G7.mp3',*/
					//	/*'Ab1': 'Ab1.mp3',*/ 'Ab2': 'Ab2.mp3', 'Ab3': 'Ab3.mp3', 'Ab4': 'Ab4.mp3', 'Ab5': 'Ab5.mp3', /*'Ab6': 'Ab6.mp3', 'Ab7': 'Ab7.mp3',*/
					//	/*'Bb0': 'Bb0.mp3', 'Bb1': 'Bb1.mp3',*/ 'Bb2': 'Bb2.mp3', 'Bb3': 'Bb3.mp3', 'Bb4': 'Bb4.mp3', 'Bb5': 'Bb5.mp3', /*'Bb6': 'Bb6.mp3', 'Bb7': 'Bb7.mp3',*/
					//	/*'Db1': 'Db1.mp3', 'Db2': 'Db2.mp3',*/ 'Db3': 'Db3.mp3', 'Db4': 'Db4.mp3', 'Db5': 'Db5.mp3', /*'Db6': 'Db6.mp3', 'Db7': 'Db7.mp3',*/
					//	/*'Eb1': 'Eb1.mp3', 'Eb2': 'Eb2.mp3',*/ 'Eb3': 'Eb3.mp3', 'Eb4': 'Eb4.mp3', 'Eb5': 'Eb5.mp3', /*'Eb6': 'Eb6.mp3', 'Eb7': 'Eb7.mp3',*/
					//	/*'Gb1': 'Gb1.mp3',*/ 'Gb2': 'Gb2.mp3', 'Gb3': 'Gb3.mp3', 'Gb4': 'Gb4.mp3', 'Gb5': 'Gb5.mp3', /*'Gb6': 'Gb6.mp3', 'Gb7': 'Gb7.mp3',*/
					//},
					//baseUrl: "/assets/app.guitarist/samples/fluidr3_gm/acoustic_guitar_steel/",
				}
			},
			...ChordsGuitar.fretboard
		}
	
		const FretboardUkulele: IFretboard = {
			...{
				name: 'ukulele',
				artwork: '/assets/app.guitarist/ukulele.png',
				colors: ['#c8af55', '#885D94', '#9a6c27',  '#436665','#815556', '#769050', '#595B8B'],
				notes: {
					x: [1005, 941, 871, 804, 739, 681, 624, 571, 521, 474, 428, 386, 347, 309, 274, 241, 209, 179, 150],
					y: {
						sequence: [282, 303],
						controls: [107, 96],
						A4: [242, 263],
						E4: [210, 221],
						C4: [179, 177],
						G4: [147, 136],
					}
				},
				caged: {
					notes: ['C', 'A', 'G', 'F', 'D'],
					jump: {
						C: [0, 3], A: [1, 2], G: [2, 2], F: [3, 3], D: [4, 2]
					},
					iteration: 7
				},
				tuners: {
					A4: [1156, 332],
					E4: [1284, 332],
					C4: [1285, 64],
					G4: [1163, 64]
				},
				tunings: {	
					'custom': {A4: 'A4', E4: 'E4', C4: 'C4', G4: 'G4'},
					'standard': {A4: 'A4', E4: 'E4', C4: 'C4', G4: 'G4'},
				},
				tone: {
					urls: {
						/*'A0': 'A0.mp3', 'A1': 'A1.mp3', 'A2': 'A2.mp3',*/ 'A3': 'A3.mp3', 'A4': 'A4.mp3', /*'A5': 'A5.mp3', /*'A6': 'A6.mp3', 'A7': 'A7.mp3',*/
						/*'B0': 'B0.mp3', 'B1': 'B1.mp3', 'B2': 'B2.mp3',*/ 'B3': 'B3.mp3', 'B4': 'B4.mp3', /*'B5': 'B5.mp3', /*'B6': 'B6.mp3', 'B7': 'B7.mp3',*/
						/*'C1': 'C1.mp3', 'C2': 'C2.mp3', 'C3': 'C3.mp3',*/ 'C4': 'C4.mp3', 'C5': 'C5.mp3',/* 'C6': 'C6.mp3', /*'C7': 'C7.mp3', 'C8': 'C8.mp3',*/
						/*'D1': 'D1.mp3', 'D2': 'D2.mp3', 'D3': 'D3.mp3',*/ 'D4': 'D4.mp3', 'D5': 'D5.mp3', /*'D6': 'D6.mp3', /*'D7': 'D7.mp3',*/
						/*'E1': 'E1.mp3', 'E2': 'E2.mp3', 'E3': 'E3.mp3',*/ 'E4': 'E4.mp3', 'E5': 'E5.mp3', /*'E6': 'E6.mp3', 'E7': 'E7.mp3',*/
						/*'F1': 'F1.mp3', 'F2': 'F2.mp3', 'F3': 'F3.mp3',*/ 'F4': 'F4.mp3', /*'F5': 'F5.mp3', /*'F6': 'F6.mp3', 'F7': 'F7.mp3',*/
						/*'G1': 'G1.mp3', 'G2': 'G2.mp3', 'G3': 'G3.mp3',*/ 'G4': 'G4.mp3', /*'G5': 'G5.mp3', /*'G6': 'G6.mp3', 'G7': 'G7.mp3',*/
						/*'Ab1': 'Ab1.mp3', 'Ab2': 'Ab2.mp3', 'Ab3': 'Ab3.mp3',*/ 'Ab4': 'Ab4.mp3', /*'Ab5': 'Ab5.mp3', /*'Ab6': 'Ab6.mp3', 'Ab7': 'Ab7.mp3',*/
						/*'Bb0': 'Bb0.mp3', 'Bb1': 'Bb1.mp3', 'Bb2': 'Bb2.mp3',*/ 'Bb3': 'Bb3.mp3', 'Bb4': 'Bb4.mp3', /*'Bb5': 'Bb5.mp3', /*'Bb6': 'Bb6.mp3', 'Bb7': 'Bb7.mp3',*/
						/*'Db1': 'Db1.mp3', 'Db2': 'Db2.mp3', 'Db3': 'Db3.mp3',*/ 'Db4': 'Db4.mp3', 'Db5': 'Db5.mp3', /*'Db6': 'Db6.mp3', /*'Db7': 'Db7.mp3',*/
						/*'Eb1': 'Eb1.mp3', 'Eb2': 'Eb2.mp3', 'Eb3': 'Eb3.mp3',*/ 'Eb4': 'Eb4.mp3', 'Eb5': 'Eb5.mp3', /*'Eb6': 'Eb6.mp3', /*'Eb7': 'Eb7.mp3',*/
						/*'Gb1': 'Gb1.mp3', 'Gb2': 'Gb2.mp3', 'Gb3': 'Gb3.mp3',*/ 'Gb4': 'Gb4.mp3', /*'Gb5': 'Gb5.mp3', /*'Gb6': 'Gb6.mp3', 'Gb7': 'Gb7.mp3',*/
					},
					baseUrl: "/assets/app.guitarist/samples/ukulele2/",
				}
			},
			...ChordsUkulele.fretboard

		}

	  	this._assets = new Assets(palette);
		this._attributes = {
			palette: palette,
			tab: {
				guitar: {
					stringno: 6,
					strokecolor: palette.grey2
				},
				ukulele: {
					stringno: 4,
					strokecolor: palette.grey2
				}
			}
		}

		new Paperless.Controls.Button({
			context: this._context,
			movable: false,
			drawable: new Paperless.Drawables.Artwork({
				context: this._context,
				content: this._assets.instruments.ukulele, 
				point: {x: window.innerWidth - 105, y: 36},
				onResize: (self?: Paperless.Drawable) => {
					self.x = window.innerWidth - 105;
				}
			}),
			onLeftClick: () => {
				let instrument: string;

				if(this._stringed)
				{
					instrument = this._stringed.fretboard.name;

					this._context.detach(this._stringed.guid);
					this._stringed = null;
				}
				
				if(!this._stringed || instrument != 'ukulele')
				{
					this._stringed = new Stringed({
						context: this._context,
						fretboard: FretboardUkulele,
						tuning: 'standard',
						onReady: (self: Stringed) => {
							self.fillFretboard();
						}
					});
				}
			},
			onInside: (self?: Paperless.Control) => {
				self.drawable.alpha = 0.7;
			},
			onOutside: (self?: Paperless.Control) => {
				self.drawable.alpha = 1;
			},
		});

		new Paperless.Controls.Button({
			context: this._context,
			movable: false,
			drawable: new Paperless.Drawables.Artwork({
				context: this._context,
				content: this._assets.instruments.guitar, 
				point: {x: window.innerWidth - 91, y: 91},
				onResize: (self?: Paperless.Drawable) => {
					self.x = window.innerWidth - 91;
				}
			}),
			onLeftClick: () => {
				if(this._stringed)
					this._context.detach(this._stringed.guid);

				this._stringed = new Stringed({
					context: this._context,
					fretboard: FretboardGuitar,
					tuning: 'standard',
					onReady: (self: Stringed) => {
						const chord = self.extractChord('A', 'minor', 0);
						//self.showChord(chord);
						//self.showCAGED('C');
						self.fillFretboard();
					}
				});
			},
			onInside: (self?: Paperless.Control) => {
				self.drawable.alpha = 0.7;
			},
			onOutside: (self?: Paperless.Control) => {
				self.drawable.alpha = 1;
			},
		});


		//this._tab =  new Tab({
		//	guitarist: this
		//});

		//this._context.attach(this._tab);
		//

		this._stringed = new Stringed({
			context: this._context,
			fretboard: FretboardUkulele,
			tuning: 'standard',
			onReady: (self: Stringed) => {
				console.log('hit');
				self.fillFretboard();
				//self.showCAGED('E');
				let chord = self.extractChord('D', 'major', 0);

				//self.showChord(chord, false);
			}
		});

		this._context.attach(document.body);



		/*
		Tone.start().then(() => {
			const instrument: Instrument = new Instrument({
				context: this._context,
				fretboard: FretboardUkulele,
				tuning: 'standard',
				onReady: (self: Instrument) => {
					const Am = self.extractChord('A', 'minor', 0);
					const C = self.extractChord('C', 'major', 0);
					const G = self.extractChord('G', 'major', 0);

					self.fillFretboard();
					//self.showChord(C);
					//self.strumChord({extract: Am, time: 0, pattern: 'down'});
					//self.strumChord({extract: Am, time: 0.25, pattern: 'up'});
					//self.strumChord({extract: C, time: 0.5, pattern: 'down'});
					//self.strumChord({extract: C, time: 0.75, pattern: 'up'});
					//self.strumChord({extract: G, time: 1, pattern: 'down'});
					//self.strumChord({extract: G, time: 1.5, pattern: 'down'});
					
					
					Tone.Transport.bpm.value = 60
					Tone.Transport.timeSignature = [4, 4];

					

					const pattern = new Tone.Pattern({
						pattern: 'down',
						playbackRate: 30,
						values: Am.strumming,
						iterations: Am.strumming.length,
						callback: (time: number, note: string) => {
							console.log('***', time);
							self.sampler.triggerAttackRelease(note);
						},
					});





  					let count: number = 0;
					Tone.Transport.scheduleRepeat((time: number) => {

						//self.sampler.triggerAttackRelease('F4', '4n', time);

						//if(count % 4 === 0)
						//	self.sampler.triggerAttackRelease('G4', '1n', time);

						//if((count + 2) % 4 === 0)
						//	self.sampler.triggerAttackRelease('G4', '1n', time);


						const [bar, beat, sixteenths] = Tone.Transport.position.split(':');
						//self.sampler.triggerAttackRelease('G4', '8n', time);
						console.log(
							'time:', (time).toFixed(3),
							'count:', count,
							'beat:', beat, 
							'bar:', bar,
						);

						//if(count % 4 === 0)
						//	pattern.start(time);
 
						count++;
					}, '8n');



					Tone.Transport.start();

				}

			});

			this._context.attach(document.body);
		});
		*/


		/*	
		new Paperless.Controls.Button({
			context: this._context,
			drawable: new Paperless.Drawables.Circle({
				context: this._context,
				outerRadius: 20,
			}),
			onLeftClick: (self: Paperless.Control) => {
				//Tone.Transport.start();

				new Stringed({
					context: this._context,
					fretboard: FretboardGuitar,
					tuning: 'standard',
					onReady: (self: Stringed) => {
						const Am = self.extractChord('A', 'minor', 0);
						const C = self.extractChord('C', 'major', 0);
						const G = self.extractChord('G', 'major', 0);
						let count: number = 0;

						self.fillFretboard();
						//self.showChord(C);
						//self.strumChord({extract: Am, time: 0, pattern: 'down'});
						//self.strumChord({extract: Am, time: 0.25, pattern: 'up'});
						//self.strumChord({extract: C, time: 0.5, pattern: 'down'});
						//self.strumChord({extract: C, time: 0.75, pattern: 'up'});
						//self.strumChord({extract: G, time: 1, pattern: 'down'});
						//self.strumChord({extract: G, time: 1.5, pattern: 'down'});


						//const pattern = new Tone.Pattern({
						//	pattern: 'down',
						//	playbackRate: 300,
						//	values: Am.strumming,
						//	iterations: Am.strumming.length,
						//	callback: (time: number, note: string) => {
						//		self.sampler.triggerAttackRelease(note, '1n', time);
						//	},
						//});

						Tone.Transport.position = 0;
						Tone.Transport.scheduleRepeat((time: number) => {
							const [bar, beat, sixteenths] = Tone.Transport.position.split(':');
							console.log(
								'time:', (time).toFixed(3),
								'count:', count,
								'beat:', beat, 
								'bar:', bar,
							);

							//if(count % 4 === 0)
							if((count + 2) % 4 === 0)
							{
								
								new Tone.Pattern({
									pattern: 'down',
									playbackRate: 30,
									values: Am.strumming,
									iterations: Am.strumming.length,
									callback: (time: number, note: string) => {
										self.sampler.triggerAttackRelease(note, '1n', time);
									}
								}).start(time);
								
							  //pattern.cancel().start(time);
							}
	 
							count++;
						}, '8n');



					}
				});

				console.clear();
				this._context.detach([self.drawable.guid, self.guid]);
			}
		});
	*/
		

		

	





	}



	// Accessors
	// --------------------------------------------------------------------------

	public get attributes(): IRootAttributes
	{
		return this._attributes;
	}

	public get assets(): Assets
	{
		return this._assets;
	}

	public get tab(): Tab
	{
		return this._tab;
	}

	public get stringed(): Stringed
	{
		return this._stringed;
	}
}


