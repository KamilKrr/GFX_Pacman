# How to run
    An http server is required so the .obj files can load

# claim
    All models are selfmade in Blender
    All images are taken from the internet

    labyrinth: fully implemented; it is automatically generated for each game
    animated Pacman: fully implemented; the pacman rotation and mouth are animated
    shear-view: fully implemented
    shadow: not implemented

    Continuous movement: fully implemented, just like in the real pacman game
    camera centers: fully implemented
    walls “solid”: fully implemented
    dots to eat: fully implemented
    jump: fully implemented
    two enemy ghosts: fully implemented

    More game-like additions:
        - counting points during game and on game-over screen
        - having lives (3 lives)
        - double jump
        - map automatically generated each game (flood fill to check if every point is reachable)
        - map size can be adjusted in game-over screen (small, medium, large)
        - nice retro GUI with images

    special state for enemies: fully implemented; after eating a red dot you can eat ghosts for 10 seconds

# tested environments
    m2 macbook macOS 14 + chrome 118 arm64 + python http.server

# additional and general remarks