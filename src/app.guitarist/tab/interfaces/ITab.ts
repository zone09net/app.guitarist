import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import {Guitarist} from '../../Guitarist.js';



export interface ITab extends Paperless.Interfaces.IComponentAttributes
{
	guitarist?: Guitarist
}

export interface IStaff extends HaC.Interfaces.Puzzled.IEntityCoreDrawableAttributes
{
	stringno?: number,
	spacing?: number,
	xoffset1?: number,
	xoffset2?: number,
}

export interface IBar extends IStaff
{
	thick?: boolean,
	begin?: boolean,
	end?: boolean,
	middle?: boolean,
	repeat?: IRepeat
}

export interface IRepeat 
{
	left?: boolean,
	right?: boolean,
	iteration?: number
}
