package dbutils

// ProcessingState indicates the state of an entry metadata processing job.
type ProcessingState int

const (
	// PSQueued is the state of an entry metadata processing job that has not
	// yet been started.
	PSQueued ProcessingState = 1

	// PSPending is the state of an entry metadata processing job that is
	// currently running.
	PSPending ProcessingState = 2

	// PSDone is the state of an entry metadata processing job that has
	// completed.
	PSDone ProcessingState = 3

	// PSFailed is the state of an entry metadata processing job that has
	// failed.
	PSFailed ProcessingState = 4
)
