package commands

import (
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var (
	version  = "unknown"
	commit   = "unknown"
	LogLevel string
)

func NewRootCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "pglet",
		Short:   "Pglet",
		Version: fmt.Sprintf("%s-%s", version, commit),
		PersistentPreRun: func(cmd *cobra.Command, args []string) {

			level := log.FatalLevel // default logging level
			level, err := log.ParseLevel(LogLevel)

			if err != nil {
				log.Fatalln(err)
			}

			log.SetLevel(level)
		},
	}

	cmd.SetVersionTemplate("{{.Version}}")

	cmd.PersistentFlags().StringVarP(&LogLevel, "log-level", "l", "info", "verbosity level for logs")

	cmd.AddCommand(
		newPageCommand(),
		newAppCommand(),
		newProxyCommand(),
		newServerCommand(),
	)

	return cmd
}