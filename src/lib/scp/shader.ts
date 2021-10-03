export default {
  vertex: `
        uniform mat4 u_normal_matrix;
        uniform mat4 u_model_view_matrix;
        uniform mat4 u_projection_matrix;
        
        attribute vec4 a_xyzt;
        attribute vec3 a_normal;
        attribute vec2 a_uv;
        
        varying lowp float v_texture_index;
        varying highp vec2 v_uv;
        varying highp vec3 v_lighting;
        
        highp vec3 calculate_lighting() {
            highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
            
            highp vec3 directionalVector = normalize(vec3(0.0, 0.0, 1.0));
            highp vec4 transformedNormal = u_normal_matrix * vec4(a_normal, 1.0);
            
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            
            return (directionalLightColor * directional);
        }
        
        void main(void) {
          v_texture_index = a_xyzt.w;
          v_uv = a_uv;
          v_lighting = calculate_lighting();
          
          gl_Position = u_projection_matrix * u_model_view_matrix * vec4(a_xyzt.xyz, 1.0);
        }
    `,

  fragment: `
        varying lowp float v_texture_index;
        varying highp vec2 v_uv;
        varying highp vec3 v_lighting;
        
        uniform sampler2D u_texture_0;
        uniform sampler2D u_texture_1;
        
        void main(void) {
            highp vec4 t0 = texture2D( u_texture_0, v_uv ) * (1.0 - v_texture_index);
            highp vec4 t1 = texture2D( u_texture_1, v_uv ) * v_texture_index;
            
            highp vec4 t = t0 + t1;
            
            gl_FragColor = vec4( t.rgb * v_lighting, t.a);
        }
    `
}
