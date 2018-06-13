# Calendar.js

A simple date and time tracking script. Supports adding various time units and displaying time and dates in various formats. It creates a character sheet called "Calendar" and tracks the various time units as attributes. 

## Usage

Commands are of the form:

	!calendar <operation> <value>

## Units

Some operations or values include unit symbols. Use the symbols below to represent various units:

| Unit | Symbol |
| --- | --- |
| second | s |
| minute | m |
| hour | h |
| day | D |
| week | W |
| month | M |
| year | Y |

## Operations

To set a value:

	!calendar =<symbol> <amount>

For example to set the time to 8 o'clock:

	!calendar =h 8

To add time use:

	!calendar +<symbol> <amount>

For example to add 3 days use:

	!calendar +D 3

To subtract time you can either add negative time or use:

	!calendar -<symbol> <amount>

For example to subtract 10 years use:

	!calendar -Y 10
		or
	!calendar +Y -10

To display the current time of day use:

	!calendar time

To display the current date use:

	!calendar date

To display a custom time format use the "format" operation and supply any text which includes unit symbols prefixed with '?'. Use '?t' to display AM/PM if not using military time. For example:

	!calendar format /desc The time is ?h:?m?t and the date is ?D/?W/?M/?Y.

## Options

If you want to use militaryTime set the character sheet attribute "militaryTime" to "true".

You can change the default max values by modifying the attribute max values in the Calendar character sheet. If you don't want to track Weeks for example set the max value for "week" to 1.

If you want to change the default time or date formats you can set the "timeFormat" or "dateFormat" attributes on the Calendar character sheet.

