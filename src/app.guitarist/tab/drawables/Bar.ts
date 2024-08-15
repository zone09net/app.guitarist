import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import {IBar} from '../interfaces/ITab.js';
import {IRepeat} from '../interfaces/ITab.js';
import {Staff} from './Staff.js';



export class Bar extends Staff
{
	private _thickline: Paperless.Drawables.Line;
	private _bar: Paperless.Drawables.Line;
	private _circles: Paperless.Drawables.Circle[] = [];
	private _thick: boolean;
	private _begin: boolean;
	private _end: boolean;
	private _middle: boolean;
	private _repeat: IRepeat;
	//---

	public constructor(attributes: IBar = {})
	{
		super({
			...{
				nofill: true,
				nostroke: true,
				xoffset1: 0,
				xoffset2: 0,
				repeat: {
					left: false,
					right: false,
					iteration: 1
				}
			},
			...attributes,
		});

		const {
			thick = false,
			begin = false,
			end = false,
			middle = false,
			repeat = {},
		} = attributes;

		this._thick = thick;
		this._begin = begin;
		this._end = end;
		this._middle = middle;
		this._repeat = repeat;

		this._bar = new Paperless.Drawables.Line({
			linewidth: 2,
			strokecolor: this.strokecolor,
			point0: {x: this.x, y: this.y},
			point1: {x: this.x, y: this.y},
			hoverable: false, 
			sticky: this.sticky, 
			generate: false,
			matrix: this.matrix,
			offset1: new Paperless.Point(this.puzzled.point.x, this.puzzled.point.y + this.spacing)
		});

		this.puzzled.context.enroll(this._bar);

		if((begin || end) && !(begin && end) && !middle)
		{
			this._thickline = new Paperless.Drawables.Line({
				linewidth: 6,
				strokecolor: this.strokecolor,
				point0: {x: this.x, y: this.y},
				point1: {x: this.x, y: this.y},
				hoverable: false, 
				sticky: this.sticky, 
				generate: false,
				matrix: this.matrix,
				offset1: this.puzzled.point
			});
			
			this.puzzled.context.enroll(this._thickline);
		}

		if(repeat.left || repeat.right)
		{
			for(let i = 0; i < 4; i++)
			{
				this._circles[i] = new Paperless.Drawables.Circle({
					fillcolor: this.strokecolor,
					nostroke: true,
					outerRadius: 3,
					hoverable: false, 
					sticky: this.sticky, 
					matrix: this.matrix,
					offset1: this.puzzled.point,
				});

				this.puzzled.context.enroll(this._circles[i]);
			}
		}
	}

	public update(): void
	{
		if((this._begin || this._end) && !(this._begin && this._end) && !this._middle && this._thick)
		{
			if(this._end)
			{
				this.xoffset1 = 0;
				this.xoffset2 = 11;
			}
			else if(this._begin)
			{
				this.xoffset1 = 11;
				this.xoffset2 = 0;
			}

			this._thickline.point0 = new Paperless.Point(this.x - (this.puzzled.spacing / 2) + (this._end ? this.width : 0), this.y - (this.height / 2) + this.spacing);
			this._thickline.point1 = new Paperless.Point(this.x - (this.puzzled.spacing / 2) + (this._end ? this.width : 0), this.y + (this.height / 2) - this.puzzled.spacing - this.spacing);
			this._thickline.offset2 = {
				x: this._end ? (this.puzzled.spacing - this.xoffset2 + 8) : (this.puzzled.spacing + this.xoffset1 - 8), 
				y: this.puzzled.spacing + ((this.height) / 2)
			};

			this._thickline.generate();
		}

		if((this._begin || this._end) && !(this._begin && this._end) && !this._middle && !this._thick)
		{
			if(this._end)
			{
				this.xoffset1 = 0;
				this.xoffset2 = 11;
			}
			else if(this._begin)
			{
				this.xoffset1 = 11;
				this.xoffset2 = 0;
			}
		}

		if(this._middle)
		{
			this.xoffset1 = 0;
			this.xoffset2 = 0;

			this._bar.point0 = new Paperless.Point(this.x - (this.puzzled.spacing / 2) + (this.width / 2), this.y - (this.height / 2));
			this._bar.point1 = new Paperless.Point(this.x - (this.puzzled.spacing / 2) + (this.width / 2), this.y + (this.height / 2) - this.puzzled.spacing - (this.spacing * 2));
			this._bar.offset2 = {
				x: this._end ? (this.puzzled.spacing - this.xoffset2) : (this.puzzled.spacing + this.xoffset1), 
				y: this.puzzled.spacing + (this.height / 2)
			};
		}
		else
		{
			this._bar.point0 = new Paperless.Point(this.x - (this.puzzled.spacing / 2) + (this._end ? this.width : 0), this.y - (this.height / 2));
			this._bar.point1 = new Paperless.Point(this.x - (this.puzzled.spacing / 2) + (this._end ? this.width : 0), this.y + (this.height / 2) - this.puzzled.spacing - (this.spacing * 2));
			this._bar.offset2 = {
				x: this._end ? (this.puzzled.spacing - this.xoffset2) : (this.puzzled.spacing + this.xoffset1), 
				y: this.puzzled.spacing + (this.height / 2)
			};
		}

		if(this._repeat.left)
		{
			this._circles[0].offset2 = {
				x: this._end ? (this.xoffset1 + 11) : (this._bar.point0.x - 8), 
				y: (this.height / this.stringno) * (this.stringno == 6 ? 2 : 1)
			}
			this._circles[1].offset2 = {
				x: this._end ? (this.xoffset1 + 11) : (this._bar.point0.x - 8), 
				y: (this.height / this.stringno) * (this.stringno == 6 ? 4 : 3)
			}
		}

		if(this._repeat.right)
		{
			this._circles[2].offset2 = {
				x: this.xoffset1 + 8, 
				y: (this.height / this.stringno) * (this.stringno == 6 ? 2 : 1)
			}
			this._circles[3].offset2 = {
				x: this.xoffset1 + 8, 
				y: (this.height / this.stringno) * (this.stringno == 6 ? 4 : 3)
			}
		}


		this._bar.generate();
		this.setStaff();
	}

	public onAttach(): void
	{
		this.update();
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void 
	{
		this._bar.draw(context2D);

		if((this._begin || this._end) && !(this._begin && this._end) && !this._middle && this._thick)
			this._thickline.draw(context2D);
		
		if(this._repeat.left && !this._begin)
		{
			this._circles[0].draw(context2D);
			this._circles[1].draw(context2D);
		}

		if(this._repeat.right && !this._end)
		{
			this._circles[2].draw(context2D);
			this._circles[3].draw(context2D);
		}

		this.drawStaff(context2D)
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get thickline(): Paperless.Drawables.Line
	{
		return this._thickline;
	}

	public get bar(): Paperless.Drawables.Line
	{
		return this._bar;
	}
}

