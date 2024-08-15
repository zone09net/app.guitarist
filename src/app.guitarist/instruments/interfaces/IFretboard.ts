import * as Paperless from '@zone09.net/paperless';



export interface IFretboard extends Paperless.Interfaces.IComponentAttributes
{
	name?: string,
	artwork?: string,
	colors?: string[],
	notes?: {
		sequence?: number[],
		controls?: number[],
		x?: number[],
		y?: any,
		// y? { xx?: number[], }
	},
	caged?: {
		notes: string[],
		jump: any,
		iteration: number
	},
	tuners?: any,
	tunings?: any
	/*
	{
		standard?: any,
		// {
		// 	E4?: string[],
		// 	B3?: string[],
		// 	G3?: string[],
		// 	D3?: string[],
		// 	A2?: string[],
		// 	E2?: string[],
		// }
	},
	*/
	tone?: {
		urls?: any,
		baseUrl?: string,
	},
	keys?: string[],
	suffixes?: string[],
	chords?: any
}

