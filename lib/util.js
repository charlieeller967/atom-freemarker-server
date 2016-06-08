"use babel";

import ansiHTML from 'ansi-to-html';
import domify from 'domify';

const convert = new ansiHTML({
	newline: false,
	escapeXML: false,
	stream: true
});

export function ansiToHtml( content ) {
	return convert.toHtml( content );
};

export function htmlToDom( content ) {
	return domify( content );
}
