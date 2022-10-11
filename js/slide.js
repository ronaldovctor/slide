export default class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide)
		this.wrapper = document.querySelector(wrapper)
		this.dist = {
			finalPosition: 0,
			startX: 0,
			movement: 0,
		}
	}

	moveSlide(distX) {
		this.slide.style.transform = `translate3d(${-distX}px, 0, 0)`
		this.dist.movePosition = distX
	}

	updatePosition(clientX) {
		this.dist.movement = (this.dist.startX - clientX) * 1.6
		return this.dist.movement + this.dist.finalPosition
		// when the click fires again, remains getting the mouse
		// position but increasing with the final value if exists.
	}

	onStart(event) {
		let movetype
		if (event.type === 'mousedown') {
			event.preventDefault()
			this.dist.startX = event.clientX
			movetype = 'mousemove'
		} else {
			this.dist.startX = event.changedTouches[0].clientX
			movetype = 'touchmove'
		}
		this.wrapper.addEventListener(movetype, this.onMove)
	}

	onMove(event) {
		const pointerPosition =
			event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX
		const finalPosition = this.updatePosition(pointerPosition)
		this.moveSlide(finalPosition)
	}

	onEnd(event) {
		const movetype = event.type === 'mouseup' ? 'mousemove' : 'touchmove'
		this.wrapper.removeEventListener(movetype, this.onMove)
		this.dist.finalPosition = this.dist.movePosition
	}

	addSlideEvents() {
		this.wrapper.addEventListener('mousedown', this.onStart)
		this.wrapper.addEventListener('touchstart', this.onStart)
		this.wrapper.addEventListener('mouseup', this.onEnd)
		this.wrapper.addEventListener('touchend', this.onEnd)
	}

	bindEvents() {
		this.onStart = this.onStart.bind(this)
		this.onEnd = this.onEnd.bind(this)
		this.onMove = this.onMove.bind(this)
	}

	slidePosition(slide) {
		const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2
		return -(margin - slide.offsetLeft)
	}

	// Configs
	slidesConfig() {
		this.slideArray = [...this.slide.children].map((element) => {
			const position = this.slidePosition(element)
			return {
				element,
				position,
			}
		})
	}

	slidesIndexNav(index) {
		const last = this.slideArray.length - 1
		this.index = {
			prev: index ? index - 1 : undefined,
			active: index,
			next: index === last ? undefined : index + 1,
		}
	}

	changeSlide(index) {
		const activeSlide = this.slideArray[index]
		this.moveSlide(activeSlide.position)
		this.dist.finalPosition = activeSlide.position
		this.slidesIndexNav(activeSlide)
	}

	init() {
		this.bindEvents()
		this.addSlideEvents()
		this.slidesConfig()
		this.changeSlide(2)
		return this
	}
}
