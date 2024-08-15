import * as Paperless from '@zone09.net/paperless';



export interface IRectangle extends Paperless.Interfaces.IDrawableRectangleAttributes
{
	fillleft?: string,
	fillright?: string
}

