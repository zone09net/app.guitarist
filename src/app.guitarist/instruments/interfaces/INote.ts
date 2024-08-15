import * as Paperless from '@zone09.net/paperless';
import Tone from '@extlib/tone';
import {IShape} from './IShape.js';



export interface INote extends IShape
{
	colors?: string[],
	sampler?: Tone.Sampler,
	note: string,
	x?: boolean,
	noflat?: boolean,
	noflattext?: boolean,
	noflatcolor?: boolean,
	nooctave?: boolean,
}

