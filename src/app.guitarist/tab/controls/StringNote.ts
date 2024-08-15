import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';



export class StringNote extends HaC.Controls.Puzzled.EntityCoreControl
{
	public constructor(attributes: HaC.Interfaces.Puzzled.IEntityCoreControlAttributes)
	{
		super(attributes);

		this.movable = false;
		this.focusable = false;
		this.swappable = false;
		this.splittable = false;
		this.shrinkable = false;
		this.expandable = false;
	}
}

