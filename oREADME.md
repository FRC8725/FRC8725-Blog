![threadSBT-banner](document/image/banner.png)

threadSBT
=========

![license MIT](https://img.shields.io/badge/license-MIT-blue)
![python 3.9.6](https://img.shields.io/badge/python-3.9.6-blue)

> 2023 &copy; MaoHuPi
> 
> Document language: English / [繁體中文](document/README.zh-TW.md)
> 
> To use this template, please go to [original project location](https://github.com/maohupi/threadSBT) to download

What
----

`threadSBT` is a static Blogger Template. The overall design is based on [Jimmy](https://jimmycai.com/)’s [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack), but in addition to the basic chapter filtering and browsing functions, this template also adds: `RSS`, `Twitter Meta Card`, `Background Music Playback`, `Interactive Characters` and `Presentation View` and other extensions Function to **make the blog more easily accepted by search engine crawlers**, and also **increase the diversity of web pages in terms of use**, and **make it look more lively**.

However, this template does not use the method of "`directly writing the article content into the output HTML`" like the [Hugo](https://gohugo.io/) system (it also removes the `full text search` function). Instead, `HTML` is written as a single file, and other data content is loaded when necessary to reduce the traffic usage of `Github Page`.

How
---

This project uses `Python` to write and convert configuration files and article information into a format that is easy to use in JS. Therefore, if you cannot execute the executable file, or there is no executable file corresponding to your own system, you can download `Python `After installing the necessary function libraries (`opencv-python`, `numpy`, etc.), execute the `Python` code.

The main program of this project is `render.py`, and other `Python` files can be used to update a single data aspect. The instruction parameter rules of `render.py` are as follows:

```txt
--h, -help
--v, -version
-custom <custom directory path>
-update <update type (all / config / article / portfolio)>
```

Example of use:

```bat
python render.py -custom "custom" -update "all"
```

Versions
--------

* v1.0.0 2023/09/05 First edition.
* v1.0.1 2023/09/07 Program copying and RSS.
	1. Added the program block copy function in the article.
	2. Fixed the problem that rss could not be uploaded to github.
	3. Correct the color registration of txt and text in the program block language.
	4. Modify footer text.
* v1.0.2 2023/09/08 Article running version and preview correction.
	1. Fixed the problem that article images must have alt attributes to display properly.
	2. Add custom/style/custom.css to place custom adjusted styles.
	3. Fixed the scope error attached to tag categories such as hljs-mark.
	4. Complete the missing version mark in requirements.txt.
	5. Fixed the problem that the twitter card picture cannot be displayed.
	6. Modify the clickability of footer links.
	7. Modify the cursor style of in-page links in the Outline tab.
* v1.0.3 2023/09/09 Article running version and preview correction.
	1. Modify the default config.yaml.
	2. Added article search function.
	3. Added waving animation for interactive characters.
	4. Change the documentation location.
* v1.0.4 2023/09/10 Article running version and preview correction.
	1. Modify the copied system prompt into a floating prompt box.
	2. Fixed the missing scope of label categories such as hljs-mark (caused by v1.0.2).
* v1.0.5 2023/09/10 Improve user experience.
	1. Fixed the problem that the article search field is empty after re-entering the page (caused by v1.0.3).

TODO
----

- [ ] Tex Parse.
- [ ] Latex Parse.
- [ ] slides multi-level list text function correction.
- [ ] Related article recommendation function
	* Analysis: Browsing? , Review (1\~10)? , Like (1\~5)?
	* Data: tag, category, date
- [ ] account management