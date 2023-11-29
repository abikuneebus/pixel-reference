## Inspiration

Have you ever needed to enter a number of pixels, and found that you had no good
reference for how what 10, 50, or 100 pixels looked like? A couple of years ago,
when trying my hand at web development for the first time, I did—I found myself
looking for some sort of pixel-size reference tool. Though I've gotten better at
"eyeballing" pixel size, and have installed a few 'pixel ruler' utilities (a
Microsoft PowerToys utility, and a Google Chrome extension), there's something
to be said for the accessibility of a web application–especially for a mobile
user, or anyone using a machine they don't have full administrative privileges
to.

## Overview

'Pixel Reference Utility' is a web-based application designed as a tool for
graphic designers, digital artists, and anyone needing a quick way to visualize
pixel size. This React app leverages TypeScript, SCSS, and React-DnD to provide
a user-friendly interface and dynamic experience that's useful and responsive
regardless of what device it's accessed from.

## Features

- **Shape Generation**: All that is required to create a shape is the input of a
  width and a height, both in pixels. Optionally, a user can change to 'circle'
  from the default 'rectangle', or choose to enter an angle along with the
  dimensions that the shape will be generated at. After entering all required
  and/or optional fields, the user can hit the `Enter` key or click the
  'Generate' button, and the shape they defined will appear on the canvas.
- **Shape Selection**: Once generated, shapes can be selected for manipulation
  by simply clicking the shape. When a shape is hovered over, it pulses; when
  it's selected, its opacity increases and resize handles appear at each corner.
  Users can select a shape to move, resize, or rotate the shape, or check the
  width, height, and rotation of the shape with zero delay. Lastly, selecting a
  shape brings it to the top, allowing a user to reorganize their creations, and
  ensuring all 4 resize handles can be made accessible. Once a user is done
  manipulating generated shapes, clicking the canvas will 'deselect' the
  currently selected shape, if there is one.
- **Shape Positioning**: Once selected, shape positioning is incredibly
  intuitive, thanks to React DnD. All a user must do is click and drag by
  anywhere except for the resize handles, and the shape will move. A 'ghost' of
  the shape provides constant visual feedback to allow for precise relocation.
- **Resizing Shape**: The dimensions of selected shapes can be adjusted through
  several means. Users can either use the same 'width' and 'height' fields used
  to generate new shapes, or the resize handles located at each of the shape's
  corners. These resize handles enable a 'drag-n-drop' method of resizing, which
  pairs with the grid background of the canvas and the perpetually current
  'width' and 'height' fields to provide precise and natural size adjustment
  with instant feedback. Alternatively, one can enter a pixel value directly
  into the 'width' or 'height' field, and press `Enter` to apply the values to
  the selected shape.
- **Shape Rotation**: If a user wants to change the rotation of a generated
  shape, they have two options, both in the control panel. In the same manner a
  user can directly enter a value to change a shape's dimensions, they can enter
  an angle of rotation directly into the 'rotation' field and press `Enter` to
  apply it to the selected shape. For a more measured approach, one can use the
  '-' & '+' rotation buttons, which decrement and increment the rotation angle
  by 1° respectively—though the buttons can be held for more rapid adjustment.
  Of course, the 'rotation' input field provides immediate feedback, and will
  always show the current angle of rotation.
- **Responsive Design**: Crafted with SCSS, the app is fully responsive,
  ensuring a seamless experience across various devices and screen sizes.
- **Light/Dark Mode**: Users can toggle between light and dark modes without
  fear of affecting their shapes in any way.

## Technologies Used

- **React**: Utilizes React for a component-based architecture, enabling
  reusable components and efficient state management.
- **TypeScript**: Provides type safety for JavaScript code, enhancing code
  quality and maintainability.
- **SCSS**: Used for advanced styling of the application.
- **Create React App**: Bootstrapped with Create React App for efficient project
  setup and build processes.
- **React DnD**: Used to seamlessly implement 'drag-n-drop' functionality.

## Getting Started

To get a local copy up and running, follow these simple steps:

1. **Clone the repository**

```bash
git clone https://github.com/your-username/pixel-reference.git
```

2. **Navigate to the project directory**

```bash
cd pixel-reference
```

3. **Install dependencies**

```bash
    npm install
```

4. **Start the development server**

```bash
npm start
```

This runs the app in development mode. Open
[http://localhost:3000](http://localhost:3000/) to view it in the browser.

## Contributing

While this project primarily serves as a portfolio piece, contributions, ideas,
and feedback are welcome.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

~~John~~ Brennan O'Brien-Cahill -
[brennan.obc@gmail.com](mailto:brennan.obc@gmail.com) -
[GitHub](https://github.com/abikuneebus) -
[LinkedIn](https://www.linkedin.com/in/brennan-obriencahill/)

[Project Repo](https://github.com/abikuneebus/pixel-reference)

## Inspiration

Have you ever needed to enter a number of pixels, and found that you had no good
reference for how what 10, 50, or 100 pixels looked like? A couple of years ago,
when trying my hand at web development for the first time, I did—I found myself
looking for some sort of pixel-size reference tool. Though I've gotten better at
"eyeballing" pixel size, and have installed a few 'pixel ruler' utilities (a
Microsoft PowerToys utility, and a Google Chrome extension), there's something
to be said for the accessibility of a web application–especially for a mobile
user, or anyone using a machine they don't have full admin privileges to.

## Overview

'Pixel Reference Utility' is a web-based application designed as a tool for
graphic designers and digital artists to reference color and pixel dimensions
directly within their workflow. This React app leverages TypeScript and SCSS to
provide a user-friendly interface and dynamic experience.

## Features

- **Shape Generation**: All that is required to create a shape is the input of a
  width and a height, both in pixels. Optionally, a user can change to 'circle'
  from the default 'rectangle', or choose to enter an angle along with the
  dimensions that the shape will be generated at. After entering all required
  and/or optional fields, the user can hit the `Enter` key or ==click/tap== the
  'Generate' button, and the shape they defined will appear on the canvas.
- **Shape Selection**: Once generated, shapes can be selected for manipulation
  by simply clicking/tapping the shape. When a shape is hovered over, it pulses;
  when it's selected, its opacity increases and resize handles appear at each
  corner. Users can select a shape to move, resize, or rotate the shape, or
  check the width, height, and rotation of the shape with zero delay. Lastly,
  selecting a shape brings it to the top, allowing a user to reorganize their
  creations, and ensuring all 4 resize handles can be made accessible. Once a
  user is done manipulating generated shapes, clicking/tapping the canvas will
  'deselect' the currently selected shape, if there is one.
- **Shape Positioning**: Once selected, shape positioning is incredibly
  intuitive, thanks to React DnD. All a user must do is click/touch and drag by
  anywhere except for the resize handles, and the shape will move.
- **Resizing Shape**: The dimensions of selected shapes can be adjusted through
  several means. Users can either use the same 'width' and 'height' fields used
  to generate new shapes, or the resize handles located at each of the shape's
  corners. These resize handles enable a 'drag-n-drop' method of resizing, which
  pairs with the grid background of the canvas and the perpetually current
  'width' and 'height' fields to provide precise and natural size adjustment
  with instant feedback. Alternatively, one can enter a pixel value directly
  into the 'width' or 'height' field, and press `Enter` to apply the values to
  the selected shape.
- **Shape Rotation**: If a user wants to change the rotation of a generated
  shape, they have two options, both in the control panel. In the same manner a
  user can directly enter a value to change a shape's dimensions, they can enter
  an angle of rotation directly into the 'rotation' field and press `Enter` to
  apply it to the selected shape. For a more measured approach, one can use the
  '-' & '+' rotation buttons, which decrement and increment the rotation angle
  by 1° respectively—though the buttons can be held for more rapid adjustment.
  Of course, the 'rotation' input field provides immediate feedback, and will
  always show the current angle of rotation.
- **Responsive Design**: Through the use of SCSS and `react-dnd-touch-backend`,
  the app is fully responsive, ensuring a seamless experience across various
  devices and screen sizes.
- **Light/Dark Mode**: Users can toggle between light and dark modes without
  fear of affecting their shapes in any way.

## Technologies Used

- **React**: Utilizes React for a component-based architecture, enabling
  reusable components and efficient state management.
- **TypeScript**: Provides type safety for JavaScript code, enhancing code
  quality and maintainability.
- **SCSS**: Used for advanced styling of the application.
- **Create React App**: Bootstrapped with Create React App for efficient project
  setup and build processes.
- **React DnD**: Used to seamlessly implement 'drag-n-drop' functionality.
  - **React DnD HTML5 Backend**: Enables 'drag-n-drop' using a mouse.
  - **React DnD Touch Backend**: Enables 'drag-n-drop' using touch controls.

## Getting Started

To get a local copy up and running, follow these simple steps:

1. **Clone the repository**

```bash
git clone https://github.com/your-username/pixel-reference.git
```

2. **Navigate to the project directory**

```bash
cd pixel-reference
```

3. **Install dependencies**

```bash
    npm install
```

4. **Start the development server**

```bash
npm start
```

This runs the app in development mode. Open
[http://localhost:3000](http://localhost:3000/) to view it in the browser.

## Contributing

While this project primarily serves as a portfolio piece, contributions, ideas,
and feedback are welcome.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

~~John~~ Brennan O'Brien-Cahill -
[brennan.obc@gmail.com](mailto:brennan.obc@gmail.com) -
[GitHub](https://github.com/abikuneebus) -
[LinkedIn](https://www.linkedin.com/in/brennan-obriencahill/)

[Project Repo](https://github.com/abikuneebus/pixel-reference)
