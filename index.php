<?php

class CountDownTheDaysPlugin extends \RainLoop\Plugins\AbstractPlugin
{
	/**
	 * @return void
	 */
	public function Init()
	{
		$this->addJs('js/count-down-the-days.js');

		$this->addTemplate('templates/CountDownTheDays.html');
		$this->addTemplateHook('Login', 'BottomControlGroup', 'CountDownTheDays');
	}

	/**
	 * @return array
	 */
	public function configMapping()
	{
		return array(
			\RainLoop\Plugins\Property::NewInstance('occasion_name')->SetLabel('Name of Occasion')
				->SetPlaceholder('')
				->SetAllowedInJs(true)
				->SetDefaultValue('Halloween'),
			\RainLoop\Plugins\Property::NewInstance('occasion_date')->SetLabel('Date')
				->SetPlaceholder('Month/Day')
				->SetAllowedInJs(true)
				->SetDefaultValue('10/31'),
			\RainLoop\Plugins\Property::NewInstance('occasion_limit')->SetLabel('Days to Count Down')
				->SetPlaceholder('')
				->SetAllowedInJs(true)
				->SetDefaultValue('100'),
			\RainLoop\Plugins\Property::NewInstance('occasion_granularity')->SetLabel('Granularity')
				->SetType(\RainLoop\Enumerations\PluginPropertyType::SELECTION)
				->SetDefaultValue(array("Days", "Hours", "Minutes", "Seconds"))
				->SetAllowedInJs(true)
				->SetDescription(''),
			\RainLoop\Plugins\Property::NewInstance('occasion_background')->SetLabel('Background Image')
				->SetPlaceholder('http://')
				->SetAllowedInJs(true)
				->SetDefaultValue('http://farm1.static.flickr.com/27/58392393_80aa004a37_z.jpg?zz=1'), // https://www.flickr.com/photos/base10/58392393/in/photostream/
		);
	}
}

// http://media.idownloadblog.com/wp-content/uploads/2013/10/Halloween-Pumpkins-1024x640.jpg
