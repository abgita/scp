export default {
  vertex: `
        uniform mat4 u_model_view_matrix;
        uniform mat4 u_projection_matrix;
        
        attribute vec4 a_xyzt;
        attribute vec2 a_uv;
        
        varying lowp float v_texture_index;
        varying highp vec2 v_uv;

        void main(void) {
          v_texture_index = a_xyzt.w;
          v_uv = a_uv;
          
          gl_Position = u_projection_matrix * u_model_view_matrix * vec4(a_xyzt.xyz, 1.0);
        }
    `,

  fragment: `
        varying lowp float v_texture_index;
        varying highp vec2 v_uv;
        
        uniform sampler2D u_texture_0;
        uniform sampler2D u_texture_1;
        
        void main(void) {
            highp vec4 t0 = texture2D( u_texture_0, v_uv ) * (1.0 - v_texture_index);
            highp vec4 t1 = texture2D( u_texture_1, v_uv ) * v_texture_index;
            
            highp vec4 t = t0 + t1;
            
            gl_FragColor = vec4(t.rgb, t.a);
        }
    `
}
