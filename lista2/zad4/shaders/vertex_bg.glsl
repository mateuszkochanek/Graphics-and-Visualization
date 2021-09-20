attribute vec4 a_position;
attribute vec2 a_texcoords;

uniform mat4 u_matrix;

varying vec2 v_texcoords;

void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    v_texcoords = a_texcoords;
}