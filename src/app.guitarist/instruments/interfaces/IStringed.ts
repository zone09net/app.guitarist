import * as Paperless from '@zone09.net/paperless';
import {IFretboard} from './IFretboard.js';
import {Stringed} from '../components/Stringed.js';



export interface IStringed extends Paperless.Interfaces.IComponentAttributes
{
	fretboard?: IFretboard,
	tuning?: string,

	onReady?: (self?: Stringed) => void,
}
	
