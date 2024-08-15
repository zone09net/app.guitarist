import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import Tone from '@extlib/tone';
import {IStringed} from '../interfaces/IStringed.js';
import {IFretboard} from '../interfaces/IFretboard.js';
import {Note} from './Note.js';
import {Shape} from './Shape.js';



export interface IExtract
{
	fretboard: Record<string, {
			x: number, 
			y: number, 
			note: string,
			finger: string,
			barres: string
		}>,
	strumming: string[]
}

export interface IStrumming 
{
	extract?: IExtract,
	notes?: string[],
	pattern?: string,
	time?: number,
	rate?: number,
}


export class Stringed extends Paperless.Component 
{
	private _artwork: Paperless.Drawables.Artwork;
	private _notes: string[] = [];
	private _numbers: string[] = [];
	private _controls: string[] = [];
	private _fretboard: IFretboard;
	private _tuning: string;
	private _sampler: Tone.Sampler;
	private _nooctave: boolean = true;
	private _noflat: boolean = false;
	private _noflatcolor: boolean = true;
	private _noflattext: boolean = false;
	private _sequence: string[] = ['C', 'Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
	//---

	public constructor(attributes: IStringed) 
	{
		super(attributes);

		const {
			fretboard = {},
			tuning = 'standard',

			onReady = null,
		} = attributes;

		this._fretboard = fretboard;
		this._tuning = tuning;

		onReady ? this.onReady = onReady : null;
			this.generate();
			/*
		Tone.start().then(() => {
			Tone.Transport.bpm.value = 120
			Tone.Transport.timeSignature = [4, 4];

			this.generate();
		});
		*/
	}

	private generate(): void
	{
		this._sampler = new Tone.Sampler({
			...this._fretboard.tone,
			...{
				onload: () => {
					const image = new Image(1920, 648);
		
					image.src = this._fretboard.artwork;

					this._artwork = new Paperless.Drawables.Artwork({
						context: this.context,
						content: image,
						point: {x: window.innerWidth - 960, y: window.innerHeight - 324},
						size: {width: 1920, height: 648},
						alpha: 0.3,
						onResize: () => {
							this._artwork.x = window.innerWidth - 960;
							this._artwork.y = window.innerHeight - 324;
						}
					});
console.log('1');
					this.showNumbers();
					console.log('2');
					this.showControls();
					console.log('3');
					this.onReady(this);
				}
			}
		}).toDestination();
	}

	public extractChord(root: string, type: string, iteration: number, offset: number = 0): IExtract
	{
		const data: string = this._fretboard.chords[root][type][iteration];
		const splitted: string[] = data.split(' ');
		const extract: IExtract = {fretboard: {}, strumming: []};
		const length: number = this._fretboard.notes.x.length;
		let min: number = 50;

		let i: number = splitted[0].length - 1;
		Object.entries(this._fretboard.tunings[this._tuning]).forEach(([key, value]: any) => {
			const finger: string = splitted[1].charAt(i);

			value = parseInt(splitted[0].charAt(i--), 36);
			
			if(value != '33')
				value += offset;

			if(value < min)
				min = value;

			const delta: number = (this._fretboard.notes.y[key][1] - this._fretboard.notes.y[key][0]) / length;
			let x: number;
			let y: number;
			let note: string;

			// 33 = X
			if(value == 33)
			{
				x = this._fretboard.notes.x[min];
				y = this._fretboard.notes.y[key][0] + (min * delta);

				note = null;
			}
			else
			{
				let current: string = this._fretboard.tunings['custom'][key].slice(0, -1);
				let octave: string = this._fretboard.tunings['custom'][key].slice(-1);
				let index: number = this._sequence.indexOf(current);
				let count: number = 0;

				while(count < value)
				{
					count++;
					index++;	
										
					if(index >= this._sequence.length)
					{
						index = 0;
						octave = String(Number(octave) + 1);
					}
				} 
				
				//if(current == undefined)
				//{
				//	x = this._fretboard.notes.x[length - 1];
				//	y = this._fretboard.notes.y[key][1];
				//	note = this._fretboard.tunings[this._tuning][key][length - 1];
				//}
				//else
				//{
					x = this._fretboard.notes.x[value];
					y = this._fretboard.notes.y[key][0] + (value * delta);
					note = this._sequence[index] + octave;
				//}

				extract.strumming.push(note);
/*


				if(this._fretboard.tunings[this._tuning][key][value] == undefined)
				{
					x = this._fretboard.notes.x[length - 1];
					y = this._fretboard.notes.y[key][1];
					note = this._fretboard.tunings[this._tuning][key][length - 1];
				}
				else
				{
					x = this._fretboard.notes.x[value];
					y = this._fretboard.notes.y[key][0] + (value * delta);
					note = this._fretboard.tunings[this._tuning][key][value];
				}

				extract.strumming.push(note);
				*/
			}

			extract.fretboard[key] = {
				x: x, 
				y: y, 
				note: note,
				finger: note == null ? null : finger,
				barres: splitted[2]
			}
		});

		return extract;
	}

	public extractTunings(): string[]
	{
		const tunings: string [] = [];

		Object.entries(this._fretboard.tunings).forEach(([key]: any) => {
			if(key != 'custom')
				tunings.push(key);
		});

		return tunings;
	}

	public showNumbers(): void
	{
		const length: number = this._fretboard.notes.x.length;
		const delta: number = (this._fretboard.notes.y.sequence[1] - this._fretboard.notes.y.sequence[0]) / length;
		let y: number = this._fretboard.notes.y.sequence[0];

		this.context.states.norefresh = true;

		for(let i: number = 0; i < length; i++)
		{
			const shape: Shape = new Shape({
				context: this.context,
				layer: 0,
				point: {x: this._fretboard.notes.x[i], y: y},
				label: {
					content: String(i),
					fillcolor: '#666666',
				},
				rectangle: {
					fillleft: '#000000',
					fillright: '#000000',
					strokecolor: '#303030',
					shadow: 0
				},
			});

			this._numbers.push(shape.guid);
			y += delta;
		}

		this.context.states.norefresh = false;
		this.context.refresh();
	}

	public showControls(): void
	{
		const length: number = this._fretboard.notes.x.length;
		const delta: number = (this._fretboard.notes.y.controls[1] - this._fretboard.notes.y.controls[0]) / length;
		let y: number = this._fretboard.notes.y.controls[0];

		this.context.states.norefresh = true;

		const nooctave: Shape = new Shape({
			context: this.context,
			point: {x:  this._fretboard.notes.x[0], y: y += delta},
			alpha: 0.5,
			label: { 
				content: 'G',
				fillcolor: '#666666', 
				font: '16px Musisync',
				padding: {top: -1, left: 1},
			},
			rectangle: { 
				strokecolor: '#303030',
			},
			onLeftClick: () => {
				nooctave.alpha == 1 ? nooctave.alpha = 0.5 : nooctave.alpha = 1;
				this._nooctave = !this._nooctave;
				this.fillFretboard();
			},
		});

		const noflattext: Shape = new Shape({
			context: this.context,
			point: {x:  this._fretboard.notes.x[1], y: y += delta},
			alpha: 0.5,
			label: { 
				content: '½', 
				fillcolor: '#666666', 
				font: '30px Musisync',
				padding: {top: -9, left: 1},
			},
			rectangle: { 
				strokecolor: '#303030',
			},
			onLeftClick: () => {
				noflattext.alpha == 1 ? noflattext.alpha = 0.5 : noflattext.alpha = 1;
				this._noflattext = !this._noflattext;
				this.fillFretboard();
			},
		});

		const sharp: Shape = new Shape({
			context: this.context,
			point: {x:  this._fretboard.notes.x[2], y: y += delta},
			fillcolor: '#000000',
			alpha: 0.5,
			label: { 
				content: 'B', 
				fillcolor: '#666666', 
				font: '30px Musisync',
				padding: {top: -9, left: 1},
			},
			rectangle: { 
				strokecolor: '#303030',
			},
			onLeftClick: () => {
				if(sharp.alpha == 1)
				{
					sharp.alpha = 0.5
					flat.alpha = 1;
				}
				else
				{
					sharp.alpha = 1
					flat.alpha = 0.5;
				}

				this._noflat = !this._noflat;
				this.fillFretboard();
			},
		});

		const flat: Shape = new Shape({
			context: this.context,
			point: {x:  this._fretboard.notes.x[3], y: y += delta},
			fillcolor: '#000000',
			alpha: 1,
			label: { 
				content: 'b', 
				fillcolor: '#666666', 
				font: '30px Musisync',
				padding: {top: -7, left: 1},
			},
			rectangle: { 
				strokecolor: '#303030',
			},
			onLeftClick: () => {
				if(flat.alpha == 1)
				{
					flat.alpha = 0.5
					sharp.alpha = 1;
				}
				else
				{
					flat.alpha = 1
					sharp.alpha = 0.5;
				}

				this._noflat = !this._noflat;
				this.fillFretboard();
			},
		});

		const noflatcolor: Shape = new Shape({
			context: this.context,
			point: {x:  this._fretboard.notes.x[4], y: y += delta},
			fillcolor: '#569a2f',
			alpha: 0.5,
			label: { 
				content: 'Bb', 
				fillcolor: '#666666', 
				font: '30px Musisync',
				filter: {
					0: {
						1: { yoffset: 3, xoffset: 4 }
					}
				},
				padding: {top: -9, left: 0},
			},
			rectangle: { 
				strokecolor: '#303030',
			},
			onLeftClick: () => {
				noflatcolor.alpha == 1 ? noflatcolor.alpha = 0.5 : noflatcolor.alpha = 1;
				this._noflatcolor = !this._noflatcolor;
				this.fillFretboard();
			},
		});

		let position: number = this._fretboard.notes.x.length - this._sequence.length;
		this._sequence.forEach((current: string) => {
			const note: Note = new Note({
				context: this.context,
				note: current,
				point: {x: this._fretboard.notes.x[position++], y: y += delta},
				label: { 
					fillcolor: '#666666', 
				},
				rectangle: { 
					fillleft: '#000000',
					fillright: '#000000',
					strokecolor: '#303030',
				},
				nooctave: this._nooctave,
				noflat: this._noflat,
				noflattext: false,
				noflatcolor: true,
			});

			this._numbers.push(note.guid);
		});


		Object.entries(this._fretboard.tuners).forEach(([key, value]: any) => {
			const minus: Shape = new Shape({
				context: this.context,
				point: {x:  this._fretboard.tuners[key][0] + 13, y: this._fretboard.tuners[key][1]},
				fillcolor: '#666666',
				label: { 
					content: '-', 
					fillcolor: '#666666', 
					padding: {top: -1},
				},
				rectangle: { 
					fillleft: '#000000',
					fillright: '#000000',
					strokecolor: '#303030',
				},
				onLeftClick: () => {
					let current: string = this._fretboard.tunings['custom'][key].slice(0, -1);
					let octave: string = this._fretboard.tunings['custom'][key].slice(-1);
					let index: number = this._sequence.indexOf(current) - 1;

					if(index < 0)
					{
						index = this._sequence.length - 1;
						octave = String(Number(octave) - 1);
					}

					this._fretboard.tunings['custom'][key] = this._sequence[index] + octave

					this.fillFretboard('custom');
				},
			});

			const plus: Shape = new Shape({
				context: this.context,
				point: {x:  this._fretboard.tuners[key][0] - 13, y: this._fretboard.tuners[key][1]},
				fillcolor: '#666666',
				label: { 
					content: '+', 
					fillcolor: '#666666', 
				},
				rectangle: { 
					fillleft: '#000000',
					fillright: '#000000',
					strokecolor: '#303030',
				},
				onLeftClick: () => {
					const current: string = this._fretboard.tunings['custom'][key].slice(0, -1);
					let octave: string = this._fretboard.tunings['custom'][key].slice(-1);
					let index: number = this._sequence.indexOf(current) + 1;

					if(index >= this._sequence.length)
					{
						index = 0;
						octave = String(Number(octave) + 1);
					}

					this._fretboard.tunings['custom'][key] = this._sequence[index] + octave

					this.fillFretboard('custom');
				},
			});

			this._numbers.push(minus.guid);
			this._numbers.push(plus.guid);
		});

		this._numbers.push(nooctave.guid);
		this._numbers.push(noflattext.guid);
		this._numbers.push(flat.guid);
		this._numbers.push(sharp.guid);
		this._numbers.push(noflatcolor.guid);

		this.context.states.norefresh = false;
		this.context.refresh();

		flat.alpha = 1;
		sharp.alpha = 0.5;

	}

	public fillFretboard(tuning?: string): void
	{
		const length: number = this._fretboard.notes.x.length;

		if(tuning)
			this._tuning = tuning;

		this.clearFretboard();
		this.context.states.norefresh = true;

		Object.entries(this._fretboard.notes.y).forEach(([key, value]: any) => {
			if(key != 'sequence' && key != 'controls')
			{
				const delta: number = (value[1] - value[0]) / length;
				let y: number = value[0];
				let current: string = this._fretboard.tunings[this._tuning][key].slice(0, -1);
				let octave: string = this._fretboard.tunings[this._tuning][key].slice(-1);

				this._fretboard.tunings['custom'][key] = this._fretboard.tunings[this._tuning][key];

				for(let i = 0; i < length; i++)
				{
					let index: number = this._sequence.indexOf(current);
					const note: Note = new Note({
						context: this.context,
						sampler: this._sampler,
						note: current + octave,
						nooctave: this._nooctave,
						noflat: this._noflat,
						noflattext: this._noflattext,
						noflatcolor: this._noflatcolor,
						point: {x: this._fretboard.notes.x[i], y: y},
						colors: this._fretboard.colors,
					});

					this._notes.push(note.guid);
					y += delta;
					index++;

					if(index >= this._sequence.length)
					{
						index = 0;
						octave = String(Number(octave) + 1);
					}
					current = this._sequence[index];
				}
			}
		});

		this.context.states.norefresh = false;
		this.context.refresh();
	}

	public clearFretboard(): void
	{
		this.context.detach(this._notes);
		this._notes = [];
	}

	public showChord(extract: IExtract, finger: boolean = false): void
	{
		this.clearFretboard();
		this.context.states.norefresh = true;

		Object.entries(extract.fretboard).forEach(([key, value]: any) => {
			if(value.note)
			{
				const note: Note = new Note({
					context: this.context,
					note: value.note,
					sampler: value.note ? this._sampler : null,
					point: {x: value.x, y: value.y},
					label: {
						content: finger ? (value.finger == '0' ? ' ' : value.finger) : value.note,
						padding: {left: value.note == 'X' ? 0.5 : 0},
					},
					rectangle: {
						fillleft: finger ? '#c8af55' : null,
						fillright: finger ? '#c8af55' : null
					}
				});

				this._notes.push(note.guid);
			}
			else
			{
				const shape: Shape = new Shape({
					context: this.context,
					point: {x: value.x, y: value.y},
					label: {
						content: 'X',
						fillcolor: '#666666',
						padding: {left: 0.5, top: -0.5},
					},
					rectangle: {
						strokecolor: '#303030',
						shadow: 0
					},
				});

				this._notes.push(shape.guid);
			}
		});

		const keys: string[] = Object.values(this._fretboard.notes.y);
		
		const pickUp: Paperless.Control = new Paperless.Controls.Button({
			context: this.context,
			drawable: new Paperless.Drawables.Circle({
				context: this.context,
				outerRadius: 20,
				point: {x: window.innerWidth - 50, y: window.innerHeight - 5 - Number(keys[(keys.length - 2) / 2][1])}
			}),
			onLeftClick: () => {
				this.strumChord({extract: extract, time: Tone.now() + 1, pattern: 'down'});
			}
		});
		const pickDown: Paperless.Control = new Paperless.Controls.Button({
			context: this.context,
			drawable: new Paperless.Drawables.Circle({
				context: this.context,
				outerRadius: 20,
				point: {x: window.innerWidth - 50, y: window.innerHeight + 5 - Number(keys[((keys.length - 2) / 2) + 1][1])}
			}),
			onLeftClick: () => {
				this.strumChord({extract: extract, time: Tone.now() + 1, pattern: 'up'});
			}
		});

		this._notes.push(pickUp.drawable.guid);
		this._notes.push(pickUp.guid);
		this._notes.push(pickDown.drawable.guid);
		this._notes.push(pickDown.guid);
	
		this.context.states.norefresh = false;
		this.context.refresh();
	}

	public strumChord(strumming: IStrumming): void
	{
      const notes: string[] = strumming.notes || strumming.extract.strumming;
            
		new Tone.Pattern({
			pattern: strumming.pattern || 'down',
			playbackRate: strumming.rate || 10,
			values: notes,
			iterations: notes.length,
			callback: (time: number, note: string) => {
				this._sampler.triggerAttackRelease(note, '1n', time);
			}
		}).start();
		//}).start(strumming.time || 0);
		
		/*
		const pattern = new Tone.Pattern((time: number, note: string) => {
			this._sampler.triggerAttackRelease(note, '1n', time);
		}, notes, strumming.pattern || 'down').start(strumming.time || 0);

		pattern.playbackRate = strumming.rate || 30;
		pattern.iterations = notes.length;
		*/
		
		Tone.Transport.start();
	}

	public showCAGED(root: string): void
	{
		let rotator: number = this._fretboard.caged.jump[root][0];
		let offset: number = 0;

		this.context.states.norefresh = true;

		for(let i: number = 0; i < this._fretboard.caged.iteration; i++)
		{
			const extract: IExtract = this.extractChord(this._fretboard.caged.notes[rotator], 'major', 0, offset);

			Object.entries(extract.fretboard).forEach(([key, value]: any) => {
				if(value.note)
				{
					const note: Note = new Note({
						context: this.context,
						sampler: this._sampler,
						note: value.note,
						point: {x: value.x, y: value.y},
					});

					this._notes.push(note.guid);
				}
			});

			offset += this._fretboard.caged.jump[this._fretboard.caged.notes[rotator]][1];

			rotator++;
			if(rotator > 4)
				rotator = 0;
		}

		this.context.states.norefresh = false;
		this.context.refresh();
	}


	public onDetach(): void
	{
		this.context.detach(this._artwork.guid);
		this.context.detach(this._notes);
		this.context.detach(this._numbers);
		this.context.detach(this._controls);

		this._notes = [];
		this._numbers = [];
		this._controls = [];
	}

	public onReady(self?: Stringed): void {}



	// Accessors
	// --------------------------------------------------------------------------

	public get sampler(): Tone.Sampler
	{
		return this._sampler;
	}

	public get fretboard(): IFretboard
	{
		return this._fretboard;
	}
}


