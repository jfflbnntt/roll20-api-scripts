# Herbalism

A random table generator for herbal ingredients based on the original content by /u/dalagrath on /r/dndnext: [Herbalism and Alchemy](https://www.reddit.com/r/dndnext/comments/3w1log/5e_herbalism_alchemy_v12_updates_fanmade/)

## Usage

```
[!herbalism|!herbs] [--help|-h] [--private|-w] [terrain], where [terrain] can be any of common, arctic, coastal, underwater, desert, forest, grasslands, hills, mountain, swamp, underdark, or special. If left blank 'common' will be used. '--help' will return this message. '--private' will return the result in a whisper."
```

## Changes

**0.4**

- added 'amount' to table entries which allows ingredients to occur in differing amounts
- 'amount' is the *maximum* possible amount of the ingredient found
- 'amount' can be customized for each table entry or use one of the preset ranges: commonMax (4), uncommonMax (3), rareMax (2), specialMax (1)
- commonMax is the default if 'amount' is not defined
