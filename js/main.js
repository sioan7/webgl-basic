function main() {
    const canvas = document.querySelector('#glCanvas')
    const gl = canvas.getContext('webgl')
    if (gl === null) {
        alert('Unable to initialize WebGL. Your browser or machine might not support it.')
        return
    }

    const shaderProgram = initShaderProgram(gl, generateDefaultVertexShaderText(), generateDefaultFragmentShaderText())
    
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        }
    }

    drawScene(gl, programInfo, initBuffers(gl))
}

function initBuffers(gl) {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [
        1., 1.,
        -1., 1.,
        1., -1.,
        -1., -1.,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const colors = [
        1., 1., 1., 1.,
        1., 0., 0., 1.,
        0., 1., 0., 1.,
        0., 0., 1., 1.,
    ]
    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    return {
        position: positionBuffer,
        color: colorBuffer,
    }
}

function drawScene(gl, programInfo, buffers) {
    gl.clearColor(.0, .0, .0, 1.)
    gl.clearDepth(1.)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const fieldOfView = 45 * Math.PI / 180
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = .1
    const zFar = 100.
    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
    const modelViewMatrix = mat4.create()
    mat4.translate(modelViewMatrix, modelViewMatrix, [-.0, .0, -6.])

    {
        const numPositionComponents = 2
        const type = gl.FLOAT
        const normalize = false
        const stride = 0
        const offset = 0

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numPositionComponents,
            type,
            normalize,
            stride,
            offset,
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)

        const numColorComponents = 4

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numColorComponents,
            type,
            normalize,
            stride,
            offset,
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
    }

    gl.useProgram(programInfo.program)

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

    {
        const offset = 0
        const vertexCount = 4
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
    }
}
