//

const {readFileSync, existsSync} = require('fs');
const error = require('pug-error');

const getCurrentLocation = require('./babel-types').getCurrentLocation;
const {BaseKey, StaticBlock, DynamicBlock} = require('./block-key');

class Context {
  _variables = new Map();
  variablesToDeclare = [];
  _nextBlockID = 0;

  constructor(definesScope, key, parent, file, path, interpolations) {
    if (!definesScope && parent) {
      this.variablesToDeclare = parent.variablesToDeclare;
    }
    this._parent = parent;
    this.key = key;
    this.file = file;
    this.path = path;
    this._interpolations = interpolations;
  }

  error(code, message) {
    const options = {
      filename: this.file.opts.filename,
      line: getCurrentLocation().start.line - 1,
      src: null,
    };

    if (existsSync(options.filename)) {
      options.src = readFileSync(this.file.opts.filename, 'utf8');
    }

    return error(code, message, options);
  }

  noKey(fn) {
    const childContext = new Context(
      false,
      new BaseKey(),
      this,
      this.file,
      this.path,
    );
    const result = fn(childContext);
    childContext.end();
    return result;
  }

  staticBlock(fn) {
    const childContext = new Context(
      false,
      new StaticBlock(this.key, this._nextBlockID++),
      this,
      this.file,
      this.path,
    );
    const result = fn(childContext);
    childContext.end();
    return result;
  }

  dynamicBlock(fn) {
    const childContext = new Context(
      true,
      new DynamicBlock(this.key, 'src', 0),
      this,
      this.file,
      this.path,
    );
    const result = fn(childContext);
    childContext.end();
    return {result, variables: childContext.variablesToDeclare};
  }

  end() {
    this.key.end();
  }

  getVariable(name) {
    const variable = this._variables.get(name);

    if (variable) {
      return variable;
    }

    if (this._parent) {
      return this._parent.getVariable(name);
    }

    // TODO: maybe actually verify existance/non-const in parent scope?
    return null;
  }

  declareVariable(kind, name) {
    if (typeof name !== 'string') {
      throw new Error('variables may only be declared with strings');
    }

    const oldVariable = this._variables.get(name);

    if (oldVariable) {
      if (oldVariable.kind !== 'var' || kind !== 'var') {
        const err = this.error(
          'DUPLICATE_VARIABLE',
          `Duplicate variable ${name}.`,
        );
        throw err;
      }
      return oldVariable;
    }

    const variable = {
      kind,
      id: this.generateUidIdentifier(name),
    };

    this.variablesToDeclare.push(variable.id);
    this._variables.set(name, variable);
    return variable;
  }

  generateUidIdentifier(name) {
    return this.path.scope.generateUidIdentifier(name);
  }

  getBaseLine() {
    return this.path.node.loc.start.line;
  }

  /**
   * Check whether interpolations exist for the context, if not,
   * recursively check the parent context for the interpolation.
   * @param { String } reference - The interpolation reference
   * @returns { ?Expression } The interpolation or nothing.
   */
  getInterpolationByRef(reference) {
    let interpolation = null;

    if (
      this._interpolations &&
      (interpolation = this._interpolations.get(reference))
    ) {
      return interpolation;
    } else if (this._parent) {
      return this._parent.getInterpolationByRef(reference);
    }

    return this.getInterpolationByRef(reference);
  }

  static create(file, path, interpolations) {
    return new Context(true, new BaseKey(), null, file, path, interpolations);
  }
}

module.exports = Context;
