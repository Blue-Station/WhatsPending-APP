package com.promisepending.blueoffice.whatspending

import godot.Control
import godot.annotation.RegisterClass
import godot.annotation.RegisterFunction
import godot.global.GD

@RegisterClass
class Simple: Control() {

    @RegisterFunction
    override fun _ready() {
        GD.print("Hello world!");
    }
}
