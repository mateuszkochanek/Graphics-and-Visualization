precision mediump float;
 
varying vec3 v_normal;

 
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

 
void main() {
    vec3 normal = normalize(v_normal);
    if (gl_FrontFacing == false){
        normal = normal * vec3(-1.0,-1.0,-1.0);
    }
    float light = dot(normal, u_reverseLightDirection);

    gl_FragColor = u_color;
    gl_FragColor.rgb *= light;
}