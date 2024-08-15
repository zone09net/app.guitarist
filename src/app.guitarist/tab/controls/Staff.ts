import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import {Staff as Drawable} from '../drawables/Staff.js';



export class Staff extends HaC.Controls.Puzzled.EntityCoreControl
{
	private _focussed: boolean = false;

	public constructor(attributes: HaC.Interfaces.Puzzled.IEntityCoreControlAttributes)
	{
		super(attributes);

		this.movable = true;
		this.focusable = true;
		this.swappable = false;
		this.splittable = false;
		this.shrinkable = true;
		this.expandable = true;
	}

	public onExpanded(): void 
	{
		(<Drawable>this.drawable).setStaff();
	}

	public onShrinked(): void 
	{
		(<Drawable>this.drawable).setStaff();
	}

	public onFocus(): void
	{
		//this.drawable.nostroke = false;
		this.drawable.nofill = false;
	}

	public onLostFocus(): void
	{
		this._focussed = false;

		this.drawable.nostroke = true;
		this.drawable.nofill = true;

		this.puzzled.detach(this.puzzled.getIcons());
		this.puzzled.removeMarker();
	}

	public onLeftClick(): void
	{
		if(this.context.states.focussed == this.guid && this._focussed)
		{
			this.toggleMarker();
			this._focussed = false;
		}
		else
			this._focussed = true;

	}
}

