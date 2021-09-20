precision mediump float;
void main()
{
    float d = floor( mod(gl_FragCoord.x+gl_FragCoord.y, 2.0) );
    if( d>0.5 )
        discard;
    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
}