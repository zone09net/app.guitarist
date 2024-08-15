import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import {IStaff} from '../interfaces/ITab.js';



export class Staff extends HaC.Drawables.Puzzled.EntityCoreDrawable
{
	private _lines: Paperless.Drawables.Line[] = [];
	private _stringno: number;
	private _spacing: number;
	private _xoffset1: number;
	private _xoffset2: number;
	//---

	public constructor(attributes: IStaff = {})
	{
		super({
			...{
				nofill: true,
				nostroke: true
			},
			...attributes
		});
		
		const {
			stringno = 6,
			spacing = 16,
			xoffset1 = 0,
			xoffset2 = 0,
		} = attributes;

		this._stringno = stringno;
		this._spacing = spacing;
		this._xoffset1 = xoffset1;
		this._xoffset2 = xoffset2;

		for(let i = 0; i < this._stringno; i++)
		{
			this._lines[i] = new Paperless.Drawables.Line({
				linewidth: 2,
				strokecolor: this.strokecolor,
				point0: {x: this.x, y: this.y},
				point1: {x: this.x, y: this.y},
				hoverable: false, 
				sticky: this.sticky, 
				generate: false,
				matrix: this.matrix,
				offset1: this.puzzled.point
			});

			this.puzzled.context.enroll(this._lines[i])
		}
	}

	public onAttach(): void
	{
		this.setStaff();
	}

	public setStaff(): void
	{
		for(let i = 0; i < this._stringno; i++)
		{
			this._lines[i].point0 = new Paperless.Point(this.x, this.y + this._spacing);
			this._lines[i].point1 = new Paperless.Point(this.x + this.width - this._xoffset1 - this._xoffset2, this.y + this._spacing);
			this._lines[i].offset2 = {
				x: this._xoffset1, 
				y: (i * ((this.height - (this._spacing *  2)) / (this._stringno - 1)))
			};	

			this._lines[i].generate();
		}
	}

	public drawStaff(context2D: OffscreenCanvasRenderingContext2D): void 
	{
		for(let i = 0; i < this._stringno; i++)
			this._lines[i].draw(context2D);
	}

	public onDraw(context2D: OffscreenCanvasRenderingContext2D): void 
	{
		this.drawStaff(context2D);
	}


	// Accessors
	// --------------------------------------------------------------------------

	public get stringno(): number
	{
		return this._stringno;
	}

	public get spacing(): number
	{
		return this._spacing;
	}

	public get xoffset1(): number
	{
		return this._xoffset1;
	}
	public set xoffset1(offset: number)
	{
		this._xoffset1 = offset;
	}

	public get xoffset2(): number
	{
		return this._xoffset2;
	}
	public set xoffset2(offset: number)
	{
		this._xoffset2 = offset;
	}
}

