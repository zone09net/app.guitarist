import * as Paperless from '@zone09.net/paperless';
import Tone from '@extlib/tone';
import {INote} from '../interfaces/INote.js';
import {Shape} from './Shape.js';



export class Note extends Shape 
{
	private _note: string;
	private _sampler: Tone.Sampler
	//---

	public constructor(attributes: INote) 
	{
		super({
			...attributes,
			...{
				generate: false
			}
		});

		const {
			colors = ['#815556', '#436665', '#9a6c27', '#769050', '#c8af55', '#434466', '#227a85'],
			sampler = null,
			note = '',
			x = false,
			noflat = true,
			noflattext = false,
			noflatcolor = true,
			nooctave = true,

			onLeftClick = this.onLeftClick = (self: Paperless.Control) =>
			{
				if(sampler)
					sampler.triggerAttackRelease(note);
			},
		} = attributes;

		if(x)
		{
			this.attributes.label.content = 'X';
			this.attributes.label.fillcolor = '#666666';
			this.attributes.rectangle.fillleft = '#000000';	
			this.attributes.rectangle.fillright = '#000000';	
		}
		else
		{
			let doubled: number =  0;
			let colorleft: number = parseInt(note.charAt(0), 36) - 10;
			let colorright: number = colorleft;

			if(!noflatcolor && note.charAt(1) == 'b')
				doubled = 1;

			if(!this.attributes.label.content)
				this.attributes.label.content = <string>new String(note);

			if(note.charAt(1) == 'b')
			{
				if(!noflat)
				{
					this.attributes.label.filter = {
						0: {
							0: { xoffset: 1 },
							1: { yoffset: -15, xoffset: 1, font: '30px Musisync', fillcolor: this.attributes.label.fillcolor || '#000000' },
							2: { yoffset: 15, xoffset: -2, font: '13px impact', fillcolor: '#151515' }
						}
					}
				}
				else
				{
					let newnote: number = parseInt(note.charAt(0), 36) + 54;

					if(newnote == 64)
						newnote = 71;

					this.attributes.label.content = this.attributes.label.content.replace(note.charAt(0) + 'b', String.fromCharCode(newnote) + 'B');
					this.attributes.label.filter = {
						0: {
							0: { xoffset: 1 },
							1: { yoffset: -18, xoffset: 0, font: '30px Musisync', fillcolor: '#151515' },
							2: { yoffset: 18, xoffset: -1, font: '13px impact', fillcolor: '#151515' }
						}
					}
				}
			}

			if(noflatcolor && note.charAt(1) == 'b')
			{
				if(!this.attributes.rectangle.fillleft && !this.attributes.rectangle.fillright)
				{
					this.attributes.rectangle.fillleft = '#303030';
					this.attributes.rectangle.fillright = '#303030';
				}
			}
			else if(!noflatcolor && nooctave && note.charAt(1) == 'b')
			{
				this.attributes.label.content = 'Bb';
				this.attributes.label.fillcolor = '#000000';
				this.attributes.label.font = '30px Musisync',
				this.attributes.label.filter = {
					0: {
						0: { yoffset: -13 },
						1: { yoffset: 3, xoffset: 4 }
					}
				}
			}

			if(!this.attributes.rectangle.fillleft && !this.attributes.rectangle.fillright)
			{
				this.attributes.rectangle.fillleft = colors[colorleft - doubled < 0 ? 6 : colorleft - doubled];
				this.attributes.rectangle.fillright = colors[colorright];
			}

			if(noflattext && note.charAt(1) == 'b')
			{
				this.attributes.label.visible = false;
				this.attributes.rectangle.visible = false;
			}

			if(!nooctave)
			{
				this.attributes.rectangle.fillleft = colors[parseInt(note.slice(-1))];
				this.attributes.rectangle.fillright = colors[parseInt(note.slice(-1))];
			}

		}

		/*
		if(note == 'X')
		{
			this.attributes.label.fillcolor = '#666666';
			this.attributes.rectangle.fillcolor = '#000000';
		}
		*/



		this._sampler = sampler;
		this._note = note;

		this.generate();
	}
}

