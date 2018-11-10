function generateDefaultVertexShaderText() {
    return `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `
}

function generateDefaultFragmentShaderText() {
    return `
        void main() {
            gl_FragColor = vec4(1., 1., 1., 1.);
        }
    `
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
        return null
    }
    return shaderProgram
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPLETE_STATUS)) {
        alert(`An error ocurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader)
        return null
    }
    return shader
}