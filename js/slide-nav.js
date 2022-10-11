import Slide from './slide.js'

export default class SlideNav extends Slide {
	constructor(slide, wrapper) {
		super(slide, wrapper)

		this.bindControlEvents()
	}

	addArrow(prev, next) {
		this.prevElement = document.querySelector(prev)
		this.nextElement = document.querySelector(next)
		this.addArrowEvents()
	}

	addArrowEvents() {
		this.prevElement.addEventListener('click', this.activePrevSlide)
		this.nextElement.addEventListener('click', this.activeNextSlide)
		this.transition(true)
	}

	createControl() {
		const control = document.createElement('ul')
		control.dataset.control = 'slide'

		this.slideArray.forEach((item, index) => {
			control.innerHTML += `<li><a href='#slide${index + 1}'>${index + 1}</a></li>`
			this.wrapper.appendChild(control)
		})
		return control
	}

	eventControl(item, index) {
		item.addEventListener('click', (event) => {
			event.preventDefault()
			this.changeSlide(index)
		})
		this.wrapper.addEventListener('changeEvent', this.activeControlItem)
	}

	activeControlItem() {
		this.controlArray.forEach((item) => item.classList.remove(this.activeClass))
		this.controlArray[this.index.active].classList.add(this.activeClass)
	}

	addControl() {
		this.control = this.createControl()
		this.controlArray = [...this.control.children]
		this.controlArray.forEach((control, index) => {
			this.eventControl(control, index)
		})
		this.activeControlItem()
	}

	bindControlEvents() {
		this.activeControlItem = this.activeControlItem.bind(this)
	}
}
