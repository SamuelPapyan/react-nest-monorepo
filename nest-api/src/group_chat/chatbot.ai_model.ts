class Neuron {
  public name: string;
  public children: Neuron[];
  public label: string;
  public threshold: number;
  public bias: number;

  constructor(name, label, children, bias, threshold) {
    this.name = name
    this.children = children
    this.label = label
    this.threshold = threshold
    this.bias = bias
  }

  compare(input) {
    const p1 = this.checkByCountOfChars(input)
    const p2 = this.checkByOrderOfChars(input)
    const res = p1 * p2 + this.bias
    return res >= this.threshold
  }

  countsOfLetters(word) {
    const letters = word.split('')
    const dict = {}
    letters.forEach(val=>{
      if (dict.hasOwnProperty(val)) dict[val]++;
      else dict[val] = 1;
    });
    return dict
  }

  checkByCountOfChars(input) {
    const expectedCounts = this.countsOfLetters(this.name)
    const inputCounts = this.countsOfLetters(input)

    let p = 0
    Object.keys(expectedCounts).forEach(key=>{
      if (inputCounts[key] !== undefined)
        p +=
          inputCounts[key] > expectedCounts[key]
            ? 1
            : inputCounts[key] / expectedCounts[key];
    })
    p /= Object.keys(expectedCounts).length
    return p
  }

  checkByOrderOfChars(input) {
    const p1 = this.orderAlg1(input)
    const p2 = this.orderAlg2(input)
    return p1 + p2
  }

  orderAlg1(input) {
    let p = 0
    for (let i = 0; i < this.name.length && i < input.length; i++) {
      if (this.name[i] == input[i]) p++;
    }
    p /= this.name.length
    return p
  }

  orderAlg2(input) {
    let p = 0
    for (let i = 0; i < this.name.length; i++) {
      if (input[i + 1] && this.name[i] == input[i + 1]) p++;
      if (input[i] && this.name[i + 1] && this.name[i + 1] == input[i]) p++;
    }
    p /= this.name.length
    return p
  }
}

export const chatbotModel = [
  new Neuron(
    'workshop',
    'workshops',
    [
      new Neuron('my', 'my_workshops', null, 0, 0.4),
      new Neuron('ongoing', 'my_workshops', null, 0, 0.4),
    ],
    0,
    0.5,
  ),
  new Neuron(
    'coach',
    'coach',
    [
      new Neuron('info', 'coach_data', null, 0, 0.4),
      new Neuron('data', 'coach_data', null, 0, 0.4),
      new Neuron('phone', 'coach_phone', null, 0, 0.4),
      new Neuron('mail', 'coach_email', null, 0, 0.4),
      new Neuron('email', 'coach_email', null, 0, 0.4),
      new Neuron('name', 'coach_name', null, 0, 0.4),
    ],
    0,
    0.5,
  ),
  new Neuron('hello', 'greeting', null, 0, 0.4),
  new Neuron('hi', 'greeting', null, 0, 0.4),
  new Neuron(
    'good',
    'good',
    [
      new Neuron('morning', 'greeting', null, 0.1, 0.4),
      new Neuron('afternoon', 'greeting', null, 0.1, 0.4),
      new Neuron('evening', 'greeting', null, 0.1, 0.4),
      new Neuron('bye', 'goodbye', null, 0.1, 0.4),
    ],
    0,
    0.4,
  ),
  new Neuron('thank', 'thank', null, 0, 0.4),
  new Neuron('goodbye', 'goodbye', null, 0, 0.4),
  new Neuron('bye', 'goodbye', null, 0, 0.4),
]