attribute vec4 a_position;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;
}