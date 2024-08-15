import * as Paperless from '@zone09.net/paperless';
import {IShape} from '../interfaces/IShape.js';
import {Rectangle} from '../drawables/Rectangle.js';



export class Shape extends Paperless.Component 
{
	private _control: Paperless.Control;
	private _label: Paperless.Drawables.Label;
	private _rectangle: Paperless.Drawables.Rectangle;
	private _attributes: IShape;
	//---

	public constructor(attributes: IShape = {}) 
	{
		super(attributes);

		const {
			label = {},
			rectangle = {},
			fillcolor = null,
			alpha = 1,
			generate = true,

			onLeftClick = null,
			onInside = null,
			onOutside = null,
		} = attributes;

		onLeftClick ? this.onLeftClick = onLeftClick : null;
		onInside ? this.onInside = onInside : null;
		onOutside ? this.onOutside = onOutside : null;

		if(fillcolor)
			rectangle.fillcolor = fillcolor;

		this._attributes = {
			label: {
				...{
					content: label.content || '',
					font: '13px impact',
					fillcolor: '#151515',
					alpha: alpha
				},
				...label,
				...{
					hoverable: false,
					autosize: true,
					corner: false,
				}
			},
			rectangle: {
				...{
					strokecolor: '#151515',
					shadowcolor: '#151515',
					shadow: 0,
					size: {width: 25, height: 16},
					alpha: alpha
				},
				...rectangle,
				...{
					linewidth: 3,
					visible: label.content == '' ? false : true,
				}
			}
		}

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		this._rectangle = new Rectangle({
			...this._attributes.rectangle,
			...{
				context: this.context,
				point: {x:  window.innerWidth - this.x, y: window.innerHeight - this.y},
				onResize: () => {
					this._rectangle.x = window.innerWidth - this.x;
					this._rectangle.y = window.innerHeight - this.y;
				}
			},		
		});
		
		this._label = new Paperless.Drawables.Label({
			...this._attributes.label,
			...{
				context: this.context,
				matrix: this._rectangle.matrix,
			}
		});

		this._control = new Paperless.Control({
			context: this.context,
			drawable: this._rectangle,
			movable: false,
			onLeftClick: this.onLeftClick,
			onInside: this.onInside,
			onOutside: this.onOutside,
		});
	}

	public onLeftClick(self: Paperless.Control): void {}

	public onInside(self: Paperless.Control): void
	{
		self.drawable.shadow = 3;
		self.drawable.shadowcolor = (<Rectangle>self.drawable).fillleft;
	}

	public onOutside(self: Paperless.Control): void
	{
		self.drawable.shadow = 0;
		self.drawable.shadowcolor = '#151515';
	}

	public onDetach(): void
	{
		this.context.detach([
			this._label.guid,
			this._rectangle.guid,
			this._control.guid
		]);
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get attributes(): IShape
	{
		return this._attributes;
	}
	public set attributes(attributes: IShape)
	{
		this._attributes = attributes;
	}

	public get alpha(): number
	{
		return this._attributes.alpha;
	}
	public set alpha(alpha: number)
	{
		this._attributes.alpha = alpha;
		this._control.drawable.alpha = alpha;
		this._label.alpha = alpha;
	}
}

