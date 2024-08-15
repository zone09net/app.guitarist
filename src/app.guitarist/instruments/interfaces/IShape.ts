import * as Paperless from '@zone09.net/paperless';
import {IRectangle} from './IRectangle.js';



export interface IShape extends Paperless.Interfaces.IComponentAttributes
{
	label?: Paperless.Interfaces.IDrawableLabelAttributes,
	rectangle?: IRectangle,
	fillcolor?: string,
	alpha?: number,
	generate?: boolean,

	onLeftClick?: (self?: Paperless.Control) => void,
	onInside?: (self?: Paperless.Control) => void,
	onOutside?: (self?: Paperless.Control) => void,
}

