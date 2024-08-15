import * as Paperless from '@zone09.net/paperless';
import * as HaC from '@zone09.net/hac';
import * as Controls from '../controls/Controls.js';
import * as Drawables from '../drawables/Drawables.js';
import {Guitarist} from '../../Guitarist.js';
import {ITab} from '../interfaces/ITab.js';



export class Tab extends Paperless.Component 
{
	private _guitarist: Guitarist;
	private _puzzled: HaC.Components.Puzzled;
	//---

	public constructor(attributes: ITab = {}) 
	{
		super(attributes);

		this._guitarist = attributes.guitarist;

	}

	public onAttach(): void
	{
		this._puzzled = new HaC.Components.Puzzled({
			context: this.context,
			point: {x: 16, y: 16},
			size: {width: 1664, height: window.innerHeight - 16},
			hop: 16, 
			expandable: false,
			nofill: false,
			nostroke: false,
			linewidth: 2,
			spacing: 0,
			shadow: 5,
			alpha: 0.4,
			color: {
				 fill: '#000000', 
				 stroke: '#000000', 
				 marked: '#815556', 
				 iconshadow: '#815556',
				 move: '#476e20',
				 nomove: '#6e2020', 
				 sizer: '#436665', 
				 splitter: '#436665', 
				 highlight: '#ffffff', 
				 faked: '#151515'
			}
		});

		this._puzzled.new([
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						begin: true,
						thick: true,
						repeat: {
							right: true
						}
					}
				},
			},

			// measure 1
			{
				size: new Paperless.Size(512, 192),
				control: Controls.Staff,
				drawable: Drawables.Staff,
				attributes: this._guitarist.attributes.tab.guitar,
			},
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						middle: true,
					}
				},
			},
			// measure 2
			{
				size: new Paperless.Size(512, 192),
				control: Controls.Staff,
				drawable: Drawables.Staff,
				attributes: this._guitarist.attributes.tab.guitar,
			},
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						middle: true,
					}
				},
			},
			// measure 3
			{
				size: new Paperless.Size(512, 192),
				control: Controls.Staff,
				drawable: Drawables.Staff,
				attributes: this._guitarist.attributes.tab.guitar,
			},
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						end: true,
						repeat: {
							left: true,
						}
					}
				},
			},

			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						begin: true,
					}
				},
			},
			{
				size: new Paperless.Size(512, 192),
				control: Controls.Staff,
				drawable: Drawables.Staff,
				attributes: this._guitarist.attributes.tab.guitar,
			},
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						middle: true,
					}
				},
			},
			{
				size: new Paperless.Size(512, 192),
				control: Controls.Staff,
				drawable: Drawables.Staff,
				attributes: this._guitarist.attributes.tab.guitar,
			},
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						middle: true,
					}
				},
			},
			{
				size: new Paperless.Size(512, 192),
				control: Controls.Staff,
				drawable: Drawables.Staff,
				attributes: this._guitarist.attributes.tab.guitar,
			},
			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: {
					...this._guitarist.attributes.tab.guitar,
					...{
						end: true,
						thick: true
					}
				},
			},


			{
				size: new Paperless.Size(16, 32),
				control: HaC.Controls.Puzzled.EntityCoreControl,
				drawable: HaC.Drawables.Puzzled.EntityCoreDrawable,
				backdoor: {
					stackable: true
				}
			},
			
			{
				control: HaC.Controls.Puzzled.EntityCoreControl,
				drawable: HaC.Drawables.Puzzled.EntityCoreDrawable,
			},
			{
				control: HaC.Controls.Puzzled.EntityCoreControl,
				drawable: HaC.Drawables.Puzzled.EntityCoreDrawable,
			},
			{
				control: HaC.Controls.Puzzled.EntityCoreControl,
				drawable: HaC.Drawables.Puzzled.EntityCoreDrawable,
			},
			/*

			{
				size: new Paperless.Size(32, 192),
				control: Controls.Bar,
				drawable: Drawables.Bar,
				attributes: this._guitarist.attributes.tab.begin,
			},

			{
				size: new Paperless.Size(512, 192),
				control: Controls.Measure,
				drawable: Drawables.Measure,
				attributes: this._guitarist.attributes.tab.begin,
			},
			{
				size: new Paperless.Size(128, 192),
				control: HaC.Controls.Puzzled.EntityCoreControl,
				drawable: HaC.Drawables.Puzzled.EntityCoreDrawable,
			},
			*/
		]);
	}



	// Accessors
	// --------------------------------------------------------------------------

	public get guitarist(): Guitarist
	{
		return this._guitarist;
	}


}
