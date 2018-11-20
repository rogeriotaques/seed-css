<?php 

require_once('./minifyr.php');

// get settings and files to minify
// options are:
//   f			- Required. File or comma separated file list
//	 screen	- Optional. Void. Forces the download of minified file.
// 	 debug	- Optional. Void. When given, skip minification.

// $debug  = isset( $_GET[ 'debug' ] ) ? TRUE : FALSE;
// $screen = isset( $_GET[ 'screen' ] ) ? TRUE : FALSE;
// $files  = isset( $_GET[ 'f' ] ) ? $_GET[ 'f' ] : NULL;

$debug = false;
$screen = false;
$files = [__DIR__ . '/dist/seed-css.js'];

$m = new RT\Minifyr($debug, $screen);
$m->files($files)->uglify(false)->render();
?>
