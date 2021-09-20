attribute vec4 a_position;
attribute vec3 a_normal;
 
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
 
varying vec3 v_normal;
varying vec3 v_position;
 
void main() {
  gl_Position = u_worldViewProjection * a_position;
 
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_position = gl_Position.xyz;
}