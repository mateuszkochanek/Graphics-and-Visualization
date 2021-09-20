precision mediump float;
 
varying vec3 v_normal;
varying vec3 v_position;

 
uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

 
void main() {
    vec3 normal = normalize(v_normal);
    float fogDistance = length(v_position);
    float fogAmount = smoothstep(0.0, 2000.0, fogDistance);
    if (gl_FrontFacing == false){
        normal = normal * vec3(-1.0,-1.0,-1.0);
    }
    float light = dot(normal, u_reverseLightDirection);
    
    vec4 fogColor = vec4(1.0, 1.0, 1.0, 1.0);

    gl_FragColor = u_color;
    gl_FragColor.rgb *= light;
    gl_FragColor = mix(gl_FragColor, fogColor, fogAmount);  
}