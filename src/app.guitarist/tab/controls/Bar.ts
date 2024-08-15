import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import Tone from '@extlib/tone';
//import {IFretboard} from '../interfaces/IFretboard';



export interface IBar
{
	bmp?: number,
	signature?: number[],
	//fretboard?: IFretboard,
}



// https://jsfiddle.net/GarrettBodley/435jp1fa/

export class Bar extends HaC.Controls.Puzzled.EntityCoreControl
{
	public constructor(attributes: HaC.Interfaces.Puzzled.IEntityCoreControlAttributes)
	{
		super(attributes);

		this.movable = true;
		this.focusable = true;
		this.swappable = true;
		this.splittable = false;
		this.shrinkable = false;
		this.expandable = false;
	}

	public onFocus(): void
	{
		//this.drawable.nostroke = false;
		this.drawable.nofill = false;
	}

	public onLostFocus(): void
	{
		this.drawable.nostroke = true;
		this.drawable.nofill = true;
	}

	public onLeftClick(): void
	{
	}
}

