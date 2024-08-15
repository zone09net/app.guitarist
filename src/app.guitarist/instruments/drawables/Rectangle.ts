import * as Paperless from '@zone09.net/paperless';
import {IRectangle} from '../interfaces/IRectangle.js';



export class Rectangle extends Paperless.Drawables.Rectangle
{
	private _fillleft: string;
	private _fillright: string;
	private _path1: Path2D;
	private _path2: Path2D;
	//---

	public constructor(attributes: IRectangle= {})
	{
		super({
			...{
				rounded: {topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5},
			},
			...attributes,
			...{
				generate: false
			}
		});

		const {
			fillleft = '#000000',
			fillright = '#000000',
			strokecolor = '#151515',
		} = attributes;

		this._fillleft = fillleft;
		this._fillright = fillright;

		this.generate();
	}

	public generate(): void
	{
		const point: Paperless.Point = new Paperless.Point(-this.width / 2, -this.height / 2);
		const points: Paperless.Point[] = [
			new Paperless.Point(point.x, point.y),
			new Paperless.Point(point.x + this.width, point.y),
			new Paperless.Point(point.x + this.width, point.y + this.height),
			new Paperless.Point(point.x, point.y + this.height),
		];

		this.path = new Path2D();
		this.path.moveTo(points[0].x + this.rounded.topLeft, points[0].y);
		this.path.lineTo(points[1].x - this.rounded.topRight, points[1].y);
		this.path.quadraticCurveTo(points[1].x, points[1].y, points[1].x, points[1].y + this.rounded.topRight);
		this.path.lineTo(points[2].x, points[2].y - this.rounded.bottomRight);
		this.path.quadraticCurveTo(points[2].x, points[2].y, points[2].x - this.rounded.bottomRight, points[2].y);
		this.path.lineTo(points[3].x + this.rounded.bottomLeft, points[3].y);
		this.path.quadraticCurveTo(points[3].x, points[3].y, points[3].x, points[3].y - this.rounded.bottomLeft);
		this.path.lineTo(points[0].x, points[0].y + this.rounded.topLeft);
		this.path.quadraticCurveTo(points[0].x, points[0].y, points[0].x + this.rounded.topLeft, points[0].y);
		this.path.closePath();

		this._path1 = new Path2D();
		this._path1.moveTo(points[0].x + this.rounded.topLeft, points[0].y);
		this._path1.lineTo(points[1].x - (this.width / 2), points[1].y);
		this._path1.lineTo(points[2].x - (this.width / 2), points[2].y);
		this._path1.lineTo(points[3].x + this.rounded.bottomLeft, points[3].y);
		this._path1.quadraticCurveTo(points[3].x, points[3].y, points[3].x, points[3].y - this.rounded.bottomLeft);
		this._path1.lineTo(points[0].x, points[0].y + this.rounded.topLeft);
		this._path1.quadraticCurveTo(points[0].x, points[0].y, points[0].x + this.rounded.topLeft, points[0].y);
		this._path1.closePath();

		this._path2 = new Path2D();
		this._path2.moveTo(points[0].x + (this.width / 2), points[0].y);
		this._path2.lineTo(points[1].x - this.rounded.topRight, points[1].y);
		this._path2.quadraticCurveTo(points[1].x, points[1].y, points[1].x, points[1].y + this.rounded.topRight);
		this._path2.lineTo(points[2].x, points[2].y - this.rounded.bottomRight);
		this._path2.quadraticCurveTo(points[2].x, points[2].y, points[2].x - this.rounded.bottomRight, points[2].y);
		this._path2.lineTo(points[3].x + (this.width / 2), points[3].y);
		this._path2.lineTo(points[0].x + (this.width / 2), points[0].y);
		this._path2.closePath();
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(
			this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 
			this.matrix.e + this.offset1.x + this.offset2.x,	
			this.matrix.f + this.offset1.y + this.offset2.y
		);

		context2D.lineWidth = this.linewidth;
		context2D.globalAlpha = this.alpha;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;
		context2D.imageSmoothingEnabled = false;

		context2D.strokeStyle = this.strokecolor;
		context2D.stroke(this.path);
				
		context2D.shadowBlur = 0;
		context2D.fillStyle = this._fillleft;
		context2D.fill(this._path1);
		context2D.fillStyle = this._fillright;
		context2D.fill(this._path2);

		context2D.restore();
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get fillleft(): string
	{
		return this._fillleft;
	}
	public set fillleft(fillleft: string)
	{
		this._fillleft = fillleft;
	}

	public get fillright(): string
	{
		return this._fillright;
	}
	public set fillright(fillright: string)
	{
		this._fillright = fillright;
	}
}

