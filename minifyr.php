<?php 

namespace RT;

class Minifyr {

  private $_version = '2.0.0';
  private $_path = '';
  private $_type = '';
  private $_extension = '';
  private $_base_url = '';
  private $_expires = '';
  private $_charset = 'utf-8';
  private $_allowed_files = array('css', 'js');
  private $_content_types = array('css' => 'text/css', 'js' => 'text/javascript');
  private $_minified = array();
  private $_files = array();
  private $_debug = false;
  private $_screen = false;
  private $_allow_compression = true;
  private $_allow_cache = true;
  private $_uglify = false;

  function __construct ($debug = false, $screen = false) {
    $this->_debug = $debug;
    $this->_screen = $screen;

    // retrieve current url in which file is being called
    $this->_base_url = isset($_SERVER['HTTPS']) 
      ? 'http' . (
          isset($_SERVER['HTTPS']) 
            ? 's' 
            : ''
          ) . '://' . preg_replace('/\/\//', '/', "{$_SERVER['HTTP_HOST']}/{$_SERVER['REQUEST_URI']}")
      : '';
    $this->_base_url = pathinfo(substr($this->_base_url, 0, strpos($this->_base_url, '?')));

    $this->_expires = gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT';
  } // __construct

  public function compression ( $flag = true ) {
    $this->_allow_compression = $flag;
    return $this;
  } // compression

  public function cache ( $flag = true ) {
    $this->_allow_cache = $flag;
    return $this;
  } // cache

  public function uglify ( $flag = false ) {
    $this->_uglify = $flag;
    return $this;
  } // uglify

  public function expires ( $time = '' ) {
    if (!empty($time)) {
      $this->_expires = $time;
    }

    return $this;
  } // expires

  public function charset ( $charset = '' ) {
    if (!empty($charset)) {
      $this->_charset = $charset;
    }

    return $this;
  } // charset

  public function files ( $files = array() ) {
    if (is_array($files)) {
      $this->_files = array_merge($this->_files, $files);
    }

    $this->_files = array_filter($this->_files, function ($el) {
      return !empty($el) && is_string($el);
    });

    return $this;
  } // files 

  public function file ( $file = '' ) {
    if (!empty($file)) {
      $this->_files[] = $file;
    }

    return $this;
  } // file 

  public function render ( $return = false ) {

    $output = $this->run();

    // wants to return it as string?
    if ($return === true) {
      return $output;
    }

    if ($this->_allow_compression === true) {
      // enable gzip compression
      ob_start("ob_gzhandler");
    }

    if ($this->_allow_cache === true) {
      // allow cache
      header('Cache-Control: public');
    }

    // expires in a day
    header('Expires: ' . $this->_expires);

    // Set right content-type and charset ...
    header("Content-type: {$this->_type}; charset={$this->_charset}" );

    if ($this->_screen === false)
    {
      // force file as 'downloadble file
      header("Content-disposition: attachment; filename=minified.{$this->_extension}");
    }

    $header  = '/** '.PHP_EOL;
    $header .= " * Minifyr #v.{$this->_version} ".PHP_EOL;
    $header .= ' * Licensed under MIT license:'.PHP_EOL;
    $header .= ' * http://www.opensource.org/licenses/mit-license.php'.PHP_EOL;
    $header .= ' * @author Rogerio Taques (rogerio.taques@gmail.com)'.PHP_EOL;
    $header .= ' * @see https://github.com/rogeriotaques/minifyr'.PHP_EOL;
    $header .= ' */'.PHP_EOL.PHP_EOL;

    echo "{$header}{$output}";
    return true;
    
  } // render 

  private function run () {
    $output = array();

    if (count($this->_files) === 0) {
      trigger_error('Minifyr: There\'s no files to be minified!', E_WARNING);
      exit;
    }

    foreach ($this->_files as $file) {
      // allow external files
      // whenever it's an external file, load it from its source
      $external = preg_match('/^external\|/', $file) ? TRUE : FALSE;
      if ($external) $file = preg_replace('/^external\|/', 'http://', $file);

      $inf = pathinfo($file);
      $is_minified = strpos($inf['basename'], '.min') !== false;

      // ignore file if it's invalid or was minified already.
      // files considered invalid are: not allowed extensions or with path pointing to parent folders (../)
      if ( !$file || !in_array( $inf['extension'], $this->_allowed_files ) || strpos( $inf['dirname'], '../' ) !== false || in_array($inf['basename'], $this->_minified) ) {
        $output[] = "/* File: {$file} was ignored. It's invalid or was minified already. */".PHP_EOL.PHP_EOL;
        continue;
      }

      // decide the content type according first file type.
      if (empty($this->_type)) {
        $this->_type = $this->_content_types[ $inf['extension'] ];
        $this->_extension = $inf['extension'];
      }

      // if extension isn't the same of first minified files, then ignore it
      if ( $inf['extension'] != $this->_extension ) {
        $output[] = "/* File: {$file} was ignored. File's extension doesn't match file type pattern. */".PHP_EOL.PHP_EOL;
        continue;
      }

      // prevent double minification ...
      $this->_minified[] = $file;
      $minified_content = '';

      if (!$is_minified) {
        $minified_content = $this->_debug === false ? $this->minify( $file ) : @file_get_contents( $file );
        $minified_content = strpos($this->_type, 'css') !== false ? $this->fix_path( $minified_content, $this->_base_url['dirname'].'/'.$inf['dirname']) : $minified_content;
      } else {
        $minified_content = @file_get_contents($file);
      }

      $output[] = "/* File: {$file} */".PHP_EOL.PHP_EOL;

      if ($this->_uglify === true && strtolower($this->_type) === 'text/javascript') {
        $minified_content = $this->do_uglify( $minified_content );
      }

      $output[] = $minified_content.PHP_EOL.PHP_EOL;
    }

    return implode('', $output);
  } // run

  /**
   * Do minify ...
   */
  private function minify ($path = '') {
    // get file content
    $content = @file_get_contents( $path );

    // remove all comment blocks
    $content = preg_replace( '#/\*.*?\*/#s', '', $content );

    // remove all comment lines
    $content = preg_replace( '#//(.*)$#m', '', $content );

    // remove all blank spaces
    $content = preg_replace( '#\s+#', ' ', $content );

    // remove unecessary spaces (before|after) some signs ...
    $content = str_replace( array('{ ',' {'), '{', $content );
    $content = str_replace( array('} ',' }'), '}', $content );
    $content = str_replace( array('; ',' ;'), ';', $content );
    $content = str_replace( array(': ',' :'), ':', $content );
    $content = str_replace( array(', ',' ,'), ',', $content );
    $content = str_replace( array('|| ',' ||'), '||', $content );
    $content = str_replace( array('! ',' !'), '!', $content );

      // perform different ways to remove some unecesary 
      // spaces (before|after) some signs ...
      switch( $this->_type )
      {
          case 'css':

              $content = str_replace( array('( ',' ('), '(', $content );
              $content = str_replace( array(' )'), ')', $content );
              $content = str_replace( array('= ',' ='), '=', $content );

              break;

          case 'js' :

              $content = str_replace( array('( ',' ('), '(', $content );
              $content = str_replace( array(' )',') '), ')', $content );
              $content = str_replace( array('= ',' ='), '=', $content );
              $content = str_replace( array('+ ',' +'), '+', $content );
              $content = str_replace( array('- ',' -'), '-', $content );
              $content = str_replace( array('* ',' *'), '*', $content );
              $content = str_replace( array('/ ',' /'), '/', $content );

              break;
      }

    return trim( $content );
  } // minify  

  /**
   * Fix all relative paths that are given into file's content.
   * It's useful when designers provide relative paths for image or additional css files into given css file.
   * Avoid loose reference for images set in css file.
   */
  private function fix_path ( $content = '', $path = '' ) {
    // first fix path for those references without ../
    $content = preg_replace('/(url\()(\'|\"){0,1}([a-zA-Z0-9\-\_\.]+)(\.png|\.jpg|\.jpge|\.gif|\.bmp|\.PNG|\.JPG|\.JPEG|\.GIF|\.BMP])/', "$1$2{$path}/$3$4", $content);

    // then, remove last directory from given path to assure ../ will correctly replaced.
    $path = substr($path, 0, strrpos($path, '/'));
    $content = preg_replace('/(\.\.\/)/', "{$path}/$2", $content);

    return $content;
  } // fix_path

  /**
   * Get a raw JS code and returns it uglified.
   * This method relies on https://marijnhaverbeke.nl/uglifyjs uglification feature 
   * which uses Google Closure method.
   */
  private function do_uglify ( $raw_code ) {
    if (!function_exists('curl_init')) {
      trigger_error('Minifyr: Impossible to uglify your code, this PHP instance does not have CURL.');
      return $raw_code;
    }

    $curl = curl_init();
    $headers = array('application/x-www-form-urlencoded');
    $body = array( 'js_code' => $raw_code );
    
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_FAILONERROR, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($curl, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($curl, CURLOPT_VERBOSE, true);
    curl_setopt($curl, CURLINFO_HEADER_OUT, true);
    curl_setopt($curl, CURLOPT_URL, 'https://marijnhaverbeke.nl/uglifyjs');
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($body));

    $uglified = curl_exec($curl);
    $info = curl_getinfo($curl);

    if ($uglified === false) {
      $uglified = $raw_code;
    }

    return $uglified;
  } // uglify

} // class