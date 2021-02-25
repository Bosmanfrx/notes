
# Notes

## Requirements

* docker
* docker-compose

## Starting an application

`docker-compose up`

`docker-compose exec backend python manage.py migrate`

## Known issues
* Sometimes during first launch you need to restart the application (this thing needs wait-on)
* Javascript error when using Datepicker (fixed in the newest alpha of library)
* Poor error handling

## An additional feature - Handwriting

During creation of node - user can choose 2 modes
* Good old RTE
* Handwriting

Handwriting lets user draw with his finger/mouse and later transform his
drawing into text. Language is required for transformation to be accurate.

I was heavily inspired by https://github.com/ChenYuHo/handwriting.js


