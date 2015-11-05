module Board where

import Color exposing (Color, rgb)
import Graphics.Collage exposing (Form, collage, rect, filled, move)
import Graphics.Element exposing (Element)
import Window
import Mouse

-- CONSTANTS
cellSize : Float
cellSize = 16

-- MODEL
-- 2-dimensional coordinates here
type alias Coordinates = (Int, Int)

type alias Model =
  {
    points: List Coordinates,
    cursor: Coordinates
  }

-- VIEW
drawPoint : Color -> Coordinates -> Form
drawPoint color coords =
  let
    (x, y) = coords
  in
    rect cellSize cellSize
      |> filled color
      |> move (toFloat x * cellSize, toFloat y * cellSize)

view : (Int, Int) -> Model -> Element
view (w, h) model =
  let
    points =
      List.map (drawPoint (rgb 50 50 50)) model.points
    cursor =
      drawPoint (rgb 0 0 0) model.cursor
  in
    List.append points [cursor]
    |> collage w h

-- SIGNALS
port mouseClicks : Signal ()
port mouseClicks = Mouse.clicks

port model : Signal Model

main : Signal Element
main =
  Signal.map2 view Window.dimensions model
