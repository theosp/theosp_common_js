#!/usr/bin/make

BUILD_DIR = build

CLOSURE_COMPILER = ${BUILD_DIR}/google-compiler-20100918.jar

MINJAR ?= java -jar ${CLOSURE_COMPILER}

all: date.format.min.js event-emitter.min.js modes_manager.min.js query-string.min.js theosp.min.js json2.min.js base64.min.js
	@@echo "theosp commonjs build complete."

event-emitter.min.js: event-emitter.js
	@@${MINJAR} --js event-emitter.js --warning_level QUIET --js_output_file event-emitter.min.js

modes_manager.min.js: modes_manager.js
	@@${MINJAR} --js modes_manager.js --warning_level QUIET --js_output_file modes_manager.min.js

query-string.min.js: query-string.js
	@@${MINJAR} --js query-string.js --warning_level QUIET --js_output_file query-string.min.js

theosp.min.js: theosp.js
	@@${MINJAR} --js theosp.js --warning_level QUIET --js_output_file theosp.min.js

json2.min.js: json2.js
	@@${MINJAR} --js json2.js --warning_level QUIET --js_output_file json2.min.js

date.format.min.js: date.format.js
	@@${MINJAR} --js date.format.js --warning_level QUIET --js_output_file date.format.min.js

base64.min.js: base64.js
	@@${MINJAR} --js base64.js --warning_level QUIET --js_output_file base64.min.js

clean: 
	@@rm event-emitter.min.js
	@@rm modes_manager.min.js
	@@rm query-string.min.js
	@@rm theosp.min.js

.PHONY: all clean
