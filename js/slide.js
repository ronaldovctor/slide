import debounce from './debounce.js'

export default class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide)
		this.wrapper = document.querySelector(wrapper)
		this.dist = {
			finalPosition: 0,
			startX: 0,
			movement: 0,
		}
		this.activeClass = 'active'
		this.changeEvent = new Event('changeEvent')
	}

	transition(active) {
		this.slide.style.transition = active ? 'transform .3s' : ''
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
		this.transition(false)
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
		this.transition(true)
		this.changeSlideOnEnd()
	}

	changeSlideOnEnd() {
		if (this.dist.movement > 130 && this.index.next !== undefined)
			this.changeSlide(this.index.next)
		else if (this.dist.movement < -130 && this.index.prev !== undefined)
			this.changeSlide(this.index.prev)
		else this.changeSlide(this.index.active)
	}

	addSlideEvents() {
		this.wrapper.addEventListener('mousedown', this.onStart)
		this.wrapper.addEventListener('touchstart', this.onStart)
		this.wrapper.addEventListener('mouseup', this.onEnd)
		this.wrapper.addEventListener('touchend', this.onEnd)
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
		this.slidesIndexNav(index)
		this.changeActiveClass()
		this.wrapper.dispatchEvent(this.changeEvent)
	}

	changeActiveClass() {
		this.slideArray.forEach((item) => {
			item.element.classList.remove(this.activeClass)
		})
		this.slideArray[this.index.active].element.classList.add(this.activeClass)
	}

	activePrevSlide() {
		this.index.prev !== undefined && this.changeSlide(this.index.prev)
	}

	activeNextSlide() {
		this.index.next !== undefined && this.changeSlide(this.index.next)
	}

	onResize() {
		setTimeout(() => {
			this.slidesConfig()
			this.changeSlide(this.index.active)
		}, 500)
	}

	addResizeEvent() {
		window.addEventListener('resize', this.onResize)
	}

	bindEvents() {
		this.onStart = this.onStart.bind(this)
		this.onEnd = this.onEnd.bind(this)
		this.onMove = this.onMove.bind(this)
		this.onResize = debounce(this.onResize.bind(this), 50)
		this.activeNextSlide = this.activeNextSlide.bind(this)
		this.activePrevSlide = this.activePrevSlide.bind(this)
	}

	init() {
		this.bindEvents()
		this.addSlideEvents()
		this.slidesConfig()
		this.changeSlide(0)
		this.addResizeEvent()
		return this
	}
}
