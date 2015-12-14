import {findDOMNode} from 'react-dom';
import {Component} from 'react';

import {requestInterval, clearRequestInterval} from 'client/requestInterval';
import {range, pickRandom, randomInt} from 'common/utils';


const COLORS = ['red', 'green', 'yellow', 'blue'];
const PARTICLES_COUNT = 500;
const DEFAULT_MAX_RADIUS = 1500;
const GRAVITY = 5;
const ANIMATION_STEP = 32;

export default class Fireworks extends Component {
    componentWillUnmount() {
        this._stopAnimating();
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount() {
        this._particles = this._initParticles(0, 0);
    }

    componentDidMount() {
        const {top, left} = findDOMNode(this).parentElement.getBoundingClientRect();

        // Reajust initial position
        this._particles.forEach(p => {
            p.x = left;
            p.y = top;
            p.originX = left;
            p.originY = top;
        });

        // Start animating
        this._startAnimating();
    }

    _startAnimating() {
        this._intervalHandle = requestInterval(() => this.updateParticles(), ANIMATION_STEP);
    }

    _stopAnimating() {
        clearRequestInterval(this._intervalHandle);
        this._intervalHandle = null;
        this._particles = [];
        this.forceUpdate();
    }

    _initParticles(originX, originY, maxRadius = DEFAULT_MAX_RADIUS) {
        return range(PARTICLES_COUNT)
            .map((p, idx) => ({
                id: idx,
                alive: true,
                color: pickRandom(COLORS),
                originX,
                originY,
                x: originX + randomInt(-20, 20),
                y: originY + randomInt(-20, 20),
                size: randomInt(2, 4),
                velocityX: randomInt(-30, 30),
                velocityY: randomInt(-60, 10),
                forceX: 0,
                forceY: 0,
                maxRadius
            }));
    }

    updateParticles() {
        const particleElements = findDOMNode(this).children,
            particles = this._particles;
        let p, pEl, pAlive = 0;

        // http://gamedev.stackexchange.com/questions/15708/how-can-i-implement-gravity
        // Euler approximation approximation :D
        //
        // Vector forces = 0.0f;
        //
        // // gravity
        // forces += down * m_gravityConstant; // 9.8m/s/s on earth
        //
        // // left/right movement
        // forces += right * m_movementConstant * controlInput; // where input is scaled -1..1
        //
        // // add other forces in for taste - usual suspects include air resistence
        // // proportional to the square of velocity, against the direction of movement.
        // // this has the effect of capping max speed.
        //
        // Vector acceleration = forces / m_massConstant;
        // m_velocity += acceleration * timeStep;
        // m_position += velocity * timeStep;

        for (let i = 0, l = particleElements.length; i < l; i++) {
            p = particles[i];
            pEl = particleElements[i];

            if (!p.alive) {
                continue;
            }

            pAlive++;

            // Update p
            let aX = 0, aY = 0;
            aY += GRAVITY + p.forceY;
            aX += p.forceX;

            p.velocityY += aY;
            p.velocityX += aX;

            p.y += p.velocityY;
            p.x += p.velocityX;

            // Update actual style
            pEl.style.transform = `translate(${p.x}px, ${p.y}px)`;
            if (pEl.style.display === 'none') {
                pEl.style.display = 'block';
            }

            // Alive or dead
            if (Math.abs(p.x) > (p.originX + p.maxRadius)
                || Math.abs(p.y) > (p.originY + p.maxRadius)) {
                p.alive = false;
                pEl.style.display = 'none';
            }
        }

        if (pAlive === 0) {
            this._stopAnimating();
        }
    }

    _particleStyle(p) {
        const baseStyle = {
            position: 'fixed',
            display: 'none',
            top: '0px',
            left: '0px'
        };

        return Object.assign({}, baseStyle, {
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color
        });
    }

    render() {
        const particles = this._particles;
        return (
            <div className="fireworks">
                {particles.map(p => (<span style={this._particleStyle(p)} key={p.id}></span>))}
            </div>
        );
    }
}
